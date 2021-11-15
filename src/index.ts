import express from "express";
import { createServer } from "http";
import cors from "cors";
import config from "./config/config";
import routes from "./router";
import socket from "./socket";
import consola from "consola";

const app = express();
const httpServer = createServer(app);
socket(httpServer); // Attach the socket server to the app

app.use(cors());
app.use(express.json());

routes(app); // Attach the routers to the app

app.listen(config.API_PORT, () => {
  consola.success(
    `[server]: Server API is running at https://localhost:${config.API_PORT}`
  );
});

httpServer.listen(config.SOCKET_PORT, () => {
  consola.success(
    `[server]: Socket server is running at https://localhost:${config.SOCKET_PORT}`
  );
});
