import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Player } from "./config/types";
import cors from "cors";

const PORT = 4000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const users = {};
let players: Player[] = [];
let rooms = [];

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

app.use(cors());

app.get("/", (_req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  // if (!Object.keys(users).includes(body.username)) {
  //   res.status(400).send("Invalid username");
  // }
  console.log("A user wanted to login with username : ");
  res.status(200).send("Logged in successfully");
});

io.on("connection", (socket) => {
  console.log("A user has connected.");
  // TODO : Ask a username for the player

  initializePlayer(socket);
  console.log(players);

  socket.on("hello", () => {
    console.log('The user said "Hello"');
  });
  socket.on("GET/PLAYER_LIST", () => {
    io.emit("GET/PLAYER_LIST/RESPONSE", JSON.stringify(players));
  });

  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
    removePlayer(socket);
  });
});

httpServer.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
// A Game has started, there is already a list of players connected
