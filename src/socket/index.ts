import { Server } from "socket.io";
import consola from "consola";
import roomsController from "../controller/roomsController";
import playersController from "../controller/playersController";

const socket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  io.on("connection", (client) => {
    consola.info("A user has connected.");

    client.on("JOIN_ROOM", (playerId, roomId, callback) => {
      const player = playersController.getOne(playerId);
      if (player) {
        consola.info(
          `The player ${player?.username} is connecting to the game ${roomId}`
        );
        player.socketId = client.id;
        client.join(roomId);
        const room = roomsController.get(roomId);
        if (room) {
          io.to(roomId).emit("PLAYER_JOINED", player, room);
          callback({ status: "ok" });
        }
      }
      callback({
        status: "error - No player with such id.",
      });
    });

    client.on("disconnect", () => {
      consola.info(`The user with socket id : ${client.id}, has disconnected.`);
      // TODO : Send a player disconnect event to the game
      const player = playersController.getBySocketId(client.id);
      if (player?.roomId) {
        // That means, if the player is found in a game
        const room = roomsController.get(player.roomId);
        if (room) {
          const updatedRoom = roomsController.removePlayer(room.id, player.id);
          client.to(room.id).emit("PLAYER_LEFT", player, updatedRoom);
        }
      }
    });
  });
  return io;
};
export default socket;
