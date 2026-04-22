const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const getConversation = require("../helpers/getConversation");
const mongoose = require("mongoose");
const cookie = require("cookie");

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const app = express();

/***socket connection */
const server = http.createServer(app);
// console.log("server", server);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// socket running at http://localhost:8080/   because socket using same port of server

//online user
const onlineUser = new Set();
const activeChat = new Map();

io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  const rawCookie = socket.handshake.headers.cookie;
  const parsed = cookie.parse(rawCookie || "");
  // console.log("COOKIES:", parsed);
  const token = parsed.token; // 👉 cookie se token mila
  console.log("TOKEN:", token);

  try {
    //current user details
    const user = await getUserDetailsFromToken(token);

    //create a room
    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());

    io.emit("onlineUser", Array.from(onlineUser));

    socket.on("message-page", async (userId) => {
      // console.log("message page", userId);
      activeChat.set(user?._id.toString(), userId);
      try {
        // ❌ INVALID ID STOP
        if (!isValidId(userId)) return;

        const sender = new mongoose.Types.ObjectId(user?._id);
        const receiver = new mongoose.Types.ObjectId(userId);
        // console.log("sender", sender, "receiver", receiver);

        // 👉 USER DETAILS (UNCHANGED)
        const userDetails =
          await UserModel.findById(userId).select("-password");

        if (!userDetails) return;

        const payload = {
          _id: userDetails._id,
          name: userDetails.name,
          email: userDetails.email,
          profile_pic: userDetails.profile_pic,
          online: onlineUser.has(userId),
        };
        // console.log("messaging this user", payload);

        socket.emit("message-user", payload); // ✅ KEEP THIS

        // 👉 ADD THIS PART 🔥
        let convo = await ConversationModel.findOne({
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        }).populate({
          path: "messages",
          options: { sort: { createdAt: 1 } },
        });
        // console.log("convo", convo);

        socket.emit("message", convo?.messages || []); // ✅ NEW
      } catch (err) {
        console.log("🔥 message-page error:", err.message);
      }
    });

    //new message
    socket.on("new message", async (data) => {
      try {
        // ❌ INVALID ID STOP
        if (!isValidId(data?.sender) || !isValidId(data?.receiver)) {
          console.log("❌ Invalid sender/receiver");
          return;
        }
        //  console.log( "new message", data)
        const sender = new mongoose.Types.ObjectId(data.sender);
        const receiver = new mongoose.Types.ObjectId(data.receiver);

        let conversation = await ConversationModel.findOne({
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        });

        //  console.log("conversation", conversation)

        if (!conversation) {
          conversation = await ConversationModel.create({ sender, receiver });
        }
        //  console.log(" created conversation", conversation)

        const message = new MessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgByUserId: data.msgByUserId,
        });

        const saveMessage = await message.save();
        //  console.log("saveMessage", saveMessage)

        await ConversationModel.updateOne(
          { _id: conversation._id },
          {
            $push: { messages: saveMessage._id },
            $set: { updatedAt: new Date() },
          },
        );

        const convo = await ConversationModel.findById(
          conversation._id,
        ).populate({
          path: "messages",
          options: { sort: { createdAt: 1 } },
        });

        const senderRoom = data.sender.toString();
        const receiverRoom = data.receiver.toString();


        // ALWAYS SEND TO SENDER
        io.to(senderRoom).emit("message", convo?.messages || []);

        // 🔥 ACTIVE CHAT CHECK
        const activeUser = activeChat.get(receiverRoom);
        // console.log("convo messages", convo?.messages);

        if (activeUser?.toString() === data?.sender?.toString()) {
          // SAME CHAT OPEN
          io.to(receiverRoom).emit("message", convo?.messages || []);
          await MessageModel.updateMany(
            { _id: { $in: convo.messages }, msgByUserId: sender },
            { $set: { seen: true } },
          );
        }

        // ALWAYS UPDATE SIDEBAR
        const sidebarSender = await getConversation(data.sender);
        const sidebarReceiver = await getConversation(data.receiver);

        io.to(senderRoom).emit("conversation", sidebarSender);
        io.to(receiverRoom).emit("conversation", sidebarReceiver);
      } catch (err) {
        console.log("🔥 new message error:", err.message);
      }
    });

    //sidebar
    socket.on("sidebar", async (currentUserId) => {
      // console.log("currentUserId from sidebar", currentUserId);
      try {
        if (!isValidId(currentUserId)) return;

        const conversation = await getConversation(currentUserId);
        socket.emit("conversation", conversation);
      } catch (err) {
        console.log("🔥 sidebar error:", err.message);
      }
    });

    socket.on("seen", async (friendUserId) => {
      try {
        // console.log("currentUserId", user?._id);
        if (!isValidId(friendUserId)) return;

        const sender = new mongoose.Types.ObjectId(user?._id);
        const receiver = new mongoose.Types.ObjectId(friendUserId);

        let conversation = await ConversationModel.findOne({
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        });

        if (!conversation) return;

        const conversationMessageId = conversation.messages || [];

        await MessageModel.updateMany(
          { _id: { $in: conversationMessageId }, msgByUserId: receiver },
          { $set: { seen: true } },
        );

        const conversationSidebarSender = await getConversation(
          user?._id?.toString(),
        );
        const conversationSidebarReceiver = await getConversation(friendUserId);
        io.to(user?._id?.toString()).emit(
          "conversation",
          conversationSidebarSender,
        );
        io.to(friendUserId).emit("conversation", conversationSidebarReceiver);
      } catch (err) {
        console.log("🔥 seen error:", err.message);
      }
    });

    socket.on("delete-chat", async ({ userId, friendId }) => {
      const sender = new mongoose.Types.ObjectId(userId);
      const receiver = new mongoose.Types.ObjectId(friendId);

      const conversation = await ConversationModel.findOne({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      });

      if (!conversation) return;

      await MessageModel.updateMany(
        { _id: { $in: conversation?.messages } },
        {
          $addToSet: { deletedFor: userId }, // 👉 ONLY FOR THIS USER
        },
      );

      // 👉 SEND UPDATED DATA BACK
      const convo = await ConversationModel.findById(conversation._id).populate(
        {
          path: "messages",
          options: { sort: { createdAt: 1 } },
        },
      );

      io.to(userId.toString()).emit("message", convo?.messages || []);
    });

    //disconnect
    socket.on("disconnect", () => {
      onlineUser.delete(user?._id?.toString());
      io.emit("onlineUser", Array.from(onlineUser));
      activeChat.delete(user?._id?.toString());
      console.log("disconnect user ", socket.id);
    });
  } catch (error) {
    console.log("error", error);
  }
});

module.exports = {
  app,
  server,
};
