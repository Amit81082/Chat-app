import React from "react";
import { useMemo } from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avatarName = "";

  if (name) {
    const splitName = name?.split(" ");
    // console.log("splitName", splitName);

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

const bgColor = [
  "bg-slate-200",
  "bg-teal-200",
  "bg-red-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-gray-200",
  "bg-cyan-200",
  "bg-sky-200",
  "bg-blue-200",
  "bg-pink-200",
];

const randomColor = useMemo(
  () => bgColor[Math.floor(Math.random() * bgColor.length)],
  [],
);

  const isOnline = onlineUser?.includes(userId);
  // console.log("isOnline", isOnline);
  return (
    <div
      className={`text-slate-800  rounded-full font-bold relative overflow-hidden`}
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${randomColor}`}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {isOnline && (
        <div className=" absolute top-[2.4px]  left-[5.4px]  z-100">
          <div className=" w-2.5 h-2.5  bg-green-500  rounded-full  border-2  border-white"></div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
