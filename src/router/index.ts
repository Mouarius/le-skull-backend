import { Application } from "express";
import roomsRouter from "./roomsRouter";
import playersRouter from "./playersRouter";

const routes = (app: Application) => {
  app.get("/", (_req, res) => {
    res.send("<h1>Hello world</h1>");
  });
  app.use("/api/player", playersRouter);
  app.use("/api/room", roomsRouter);
};

export default routes;
