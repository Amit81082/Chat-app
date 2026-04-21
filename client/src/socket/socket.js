import { io } from "socket.io-client";

export const socketConnection = io.connect(process.env.REACT_APP_BACKEND_URL, {
  withCredentials: true,
});
