const { ConversationModel } = require("../models/ConversationModel")

const getConversation = async(currentUserId)=>{
    try{
        if(currentUserId){
            const currentUserConversation = await ConversationModel.find({
                "$or" : [
                    { sender : currentUserId },
                    { receiver : currentUserId}
                ]
            }).sort({  updatedAt : -1 }).populate('messages').populate('sender').populate('receiver')
    //  console.log("currentUserConversation",currentUserConversation)
            const conversation = currentUserConversation
              .filter((conv) => conv?.messages?.length > 0)
              .map((conv) => {
                const countUnseenMsg = conv?.messages?.reduce((preve, curr) => {
                  const msgByUserId = curr?.msgByUserId.toString();
                  // console.log("Every messages msgByUserId and currentUserId", msgByUserId, currentUserId)
                  if (msgByUserId !== currentUserId) {
                    return preve + (curr?.seen ? 0 : 1);
                  } else {
                    return preve;
                  }
                }, 0);

                // console.log("messages", conv?.messages)
                // console.log("countUnseenMsg", countUnseenMsg)
                // console.log(
                //   "last message",
                //   conv.messages[conv?.messages?.length - 1],
                // );
                // console.log("convoId", conv?._id)
                // console.log("sender", conv?.sender)
                // console.log("receiver", conv?.receiver)
                // console.log("unseenMsg", countUnseenMsg)

                return {
                  _id: conv?._id,
                  sender: conv?.sender,
                  receiver: conv?.receiver,
                  unseenMsg: countUnseenMsg,
                  lastMsg: conv.messages[conv?.messages?.length - 1],
                };
              });

            return conversation
        }else{
            return []
        }
    }catch(error){
        console.log("getConversation error",error)
        return []
    }
}

module.exports = getConversation
