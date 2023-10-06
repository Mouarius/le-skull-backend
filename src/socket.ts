import { Server } from "socket.io";
import consola from "consola";
import playersController from "./controller/playersController";
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
    const username = socket.handshake.auth.username;
    if (!username) return next(new Error("Invalid username"));

    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
      const session = sessionStore.findSession(sessionId);
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId;
        socket.username = username;
        return next();
      }
    }
    const player = playersController.create(username);
    socket.userId = player.id;
    socket.sessionId = randomId();
    socket.username = username;
    return next();
  });
  io.on("connection", (socket) => {
    sessionStore.saveSession(socket.sessionId, {
      userId: socket.userId,
      username: socket.username,
    });
    console.log("sessionId:", socket.sessionId);
    console.log("userId:", socket.userId);

    if (!socket.userId) throw new Error("Invalid or missing userId");

    const player =
      playersController.getOne(socket.userId) ??
      playersController.create("testPlayer");

    socket.emit("SESSION", { sessionId: socket.sessionId });
    console.log("player:", player);

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
