import { Router } from "express";
import usersController from "../controller/usersController";
import users from "../database/users";
import consola from "consola";

const usersRouter = Router();

usersRouter.get("/", (req, res) => {
  res.status(200).json(usersController.getAll());
});
usersRouter.post("/login", (req, res) => {
  const username = req.body.username;
  const newUser = usersController.create(username);
  consola.success("Successfully created the user :", newUser);
  res.status(201).json(newUser);
});

usersRouter.get("/:id", (req, res) => {
  const user = usersController.getOne(req.params.id);
  if (user) {
    res.status(200).json(user);
  }
  res.status(404).json({ error: "User not found." });
});

usersRouter.delete("/:id", (req, res) => {
  //TODO Check if there is errors
  const userToDelete = usersController.delete(req.params.id);
  res.status(200).json(users);
});

export default usersRouter;
