import { Server } from "socket.io";

const socket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  io.on("connection", (socket) => {
    console.log("A user has connected.");

    socket.on("hello", () => {
      console.log('The user said "Hello"');
    });
    // socket.on("GET/PLAYER_LIST", () => {
    //   io.emit("GET/PLAYER_LIST/RESPONSE", JSON.stringify(players));
    // });

    socket.on("disconnect", () => {
      console.log("A user has disconnected.");
    });
  });
  return io;
};
export default socket;
