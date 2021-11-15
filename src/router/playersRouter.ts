import { Router } from "express";
import consola from "consola";
import playersController from "../controller/playersController";
import players from "../database/players";

const playersRouter = Router();

playersRouter.get("/", (req, res) => {
  res.status(200).json(playersController.getAll());
});
playersRouter.post("/login", (req, res) => {
  const { username } = req.body;
  const newPlayer = playersController.create(username);
  consola.success("Successfully created the player :", newPlayer);
  res.status(201).json(newPlayer);
});

playersRouter.get("/:id", (req, res) => {
  const player = playersController.getOne(req.params.id);
  if (player) {
    res.status(200).json(player);
  }
  res.status(404).json({ error: "User not found." });
});

playersRouter.delete("/:id", (req, res) => {
  // TODO Check if there is errors
  playersController.delete(req.params.id);
  res.status(200).json(players);
});

export default playersRouter;
