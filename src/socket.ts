import { Server } from "socket.io";
import consola from "consola";
import { playersController } from "./controller/playersController";
import { gamesController as gamesController } from "./controller/gamesController";
import { sessionStore } from "./store/sessions";
import type { RequestHandler } from "express";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  ServerToServerEvents,
  SocketData,
} from "./types/socket";
import { randomId } from "./utils";
import { Player } from "./types";

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
        consola.success("Successfully found the corresponding user for the session")
        return next();
      }
    }
    consola.info("User connecting without session, creating a new session and player")
    const player = playersController.create();
    socket.userId = player.id;
    socket.sessionId = randomId();
    consola.success(`Created a new player with id ${player.id}, and session with id ${socket.sessionId}`);
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

    socket.on("JOIN_GAME", (gameId, callback) => {
      let game = gamesController.get(gameId);
      if (!game) return;
      game = gamesController.addPlayer(game?.id, player);
      if (!game) return;

      consola.info(`A player wants to join the game ${gameId}`);
      socket.join(gameId);
      socket.to(gameId).emit("GAME_UPDATED", { game: game });
      callback({ game });
    });

    socket.on(
      "CREATE_GAME",
      (data?: { roomId: string }, callback?: CallableFunction) => {
        const room = gamesController.create();
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
