import { Application } from "express";
import roomsRouter from "./roomsRouter";
import playersRouter from "./playersRouter";

export const routes = (app: Application) => {
  app.use("/api/player", playersRouter);
  app.use("/api/room", roomsRouter);
};

