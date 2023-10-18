import { Server } from "socket.io";
import consola from "consola";
import { playersController } from "./controller/playersController";
import { roomsController } from "./controller/roomsController";
import { sessionStore } from "./store/sessions";
import type { RequestHandler } from "express";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  ServerToServerEvents,
  SocketData,
} from "./types/socket";
import { randomId } from "./utils";
import { Player, User } from "./types";

export const useSocket = (
  httpServer: import("http").Server,
  sessionMiddleware: RequestHandler
) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    ServerToServerEvents,
    SocketData
  >(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.engine.use(sessionMiddleware);

  io.use((socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
      consola.info(`User connecting with sessionId : ${sessionId}`)
      const session = sessionStore.findSession(sessionId);
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId;
        socket.username = session.username;
        return next();
      }
    }
    const player = playersController.create();
    socket.userId = player.id;
    socket.sessionId = randomId();
    consola.info(`Created a new player with id ${player.id}`);
    return next();
  });

  io.on("connection", (socket) => {
    sessionStore.saveSession(socket.sessionId, {
      userId: socket.userId,
      username: socket.username,
    });

    const session = sessionStore.findSession(socket.sessionId)

    const player = playersController.getOne(socket.userId);

    if (!player) throw new Error("No player found for this id");

    socket.emit("SESSION", {
      sessionId: socket.sessionId,
      username: socket.username,
    });

    socket.on("UPDATE_USER", (playerToUpdate: Player, callback:any) => {
      consola.info("Updating the player ", player)
      const newPlayer = playersController.update(player.id, playerToUpdate)
      sessionStore.saveSession(socket.sessionId, {userId: newPlayer.id, username:newPlayer.username})
      consola.info("Updated the player ", newPlayer)
      callback({status:"SUCCESS", data:{player: {...newPlayer}}})

    })

    socket.on("JOIN_ROOM", (roomId, callback) => {
      let room = roomsController.get(roomId);
      if (!room) return;
      room = roomsController.addPlayer(room?.id, player);
      if (!room) return;

      consola.info(`A player wants to join the game ${roomId}`);
      socket.join(roomId);
      socket.to(roomId).emit("ROOM_UPDATED", { room });
      callback({ room });
    });

    socket.on(
      "CREATE_ROOM",
      (data?: { roomId: string }, callback?: CallableFunction) => {
        const room = roomsController.create();
        consola.info(`Creating the room ${room.id}`);
        callback?.({ status: "SUCCESS", data: { room } });
      }
    );

    socket.on("disconnect", () => {
      console.log("A user has disconnected.");
    });
  });
  return io;
};
