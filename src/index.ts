import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Player } from "./config/types";

const PORT = 4000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:8080", methods: ["GET", "POST"] },
});

let players: Player[] = [];

function initializePlayer(socket: Socket) {
  const newPlayer: Player = {
    id: socket.id,
    color: "",
  };
  players.push(newPlayer);
}

function removePlayer(socket: Socket) {
  players = players.filter((p) => p.id !== socket.id);
}

app.use("/", (_req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("A user has connected.");
  // TODO : Ask a username for the player

  initializePlayer(socket);

  console.log(players);

  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
    removePlayer(socket);
  });
});

httpServer.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
// A Game has started, there is already a list of players connected
