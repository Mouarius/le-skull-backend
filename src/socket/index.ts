import { Server } from "socket.io";
import consola from "consola";
import roomsController from "../controller/roomsController";

const socket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  io.on("connection", (socket) => {
    console.log("A user has connected.");

    socket.on("hello", () => {
      console.log('The user said "Hello"');
    });

    socket.on("JOIN_ROOM", (roomId, callback) => {
      consola.info(`A player wants to join the game ${roomId}`);
      socket.join(roomId);
      const room = roomsController.get(roomId);
      socket.to(roomId).emit("PLAYER_JOINED", { room });
      callback({ status: "ok" });
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
