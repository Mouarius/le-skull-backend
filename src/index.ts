import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import session from "express-session";
import consola from "consola";
import { API_PORT, SOCKET_PORT } from "./config";
import { useSocket } from "./socket";

const app = express();
const httpServer = createServer(app);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET ?? "",
  resave: false,
  saveUninitialized: true,
});

app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);

useSocket(httpServer, sessionMiddleware); // Attach the socket server to the app

app.listen(API_PORT, () => {
  consola.success(
    `[server]: Server API is running at https://localhost:${API_PORT}`
  );
});

httpServer.listen(SOCKET_PORT, () => {
  consola.success(
    `[server]: Socket server is running at https://localhost:${SOCKET_PORT}`
  );
});
