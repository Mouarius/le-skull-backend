import { Application } from "express";
import roomsRouter from "./roomsRouter";
import playersRouter from "./playersRouter";
import globalDataController from "../controller/globalDataController";

const routes = (app: Application) => {
  app.get("/", (_req, res) => {
    res.send("<h1>Hello world</h1>");
  });
  app.get("/api/colors", (_req, res) => {
    const colors = globalDataController.getColors();
    res.status(200).json(colors);
  });
  app.use("/api/player", playersRouter);
  app.use("/api/room", roomsRouter);
};

export default routes;
