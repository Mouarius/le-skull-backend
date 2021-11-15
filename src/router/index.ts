import { Application } from "express";
import usersRouter from "./usersRouter";

const routes = (app: Application) => {
  app.get("/", (_req, res) => {
    res.send("<h1>Hello world</h1>");
  });
  app.use("/api/user", usersRouter);
};

export default routes;
