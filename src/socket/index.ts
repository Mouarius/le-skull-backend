import { Server } from "socket.io";
import consola from "consola";
import roomsController from "../controller/roomsController";
import playersController from "../controller/playersController";

const socket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  io.on("connection", (socket) => {
    consola.info("A user has connected.");

    socket.on("JOIN_ROOM", (playerId, roomId, callback) => {
      const player = playersController.getOne(playerId);
      if (player) {
        player.socketId = socket.id;
        consola.info(
          `The player ${player?.username} wants to join the game ${roomId}`
        );
        socket.join(roomId);
        const room = roomsController.get(roomId);
        io.to(roomId).emit("PLAYER_JOINED", player, room);
        callback({ status: "ok" });
      }
      callback({
        status: "error - No player with such id.",
      });
    });

    socket.on("disconnect", () => {
      console.log("A user has disconnected.");
    });
  });
  return io;
};
export default socket;
