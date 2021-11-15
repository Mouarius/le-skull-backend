import { Router } from "express";
import roomsController from "../controller/roomsController";
import usersController from "../controller/playersController";

const roomsRouter = Router();

roomsRouter.get("/", (req, res) => {
  const rooms = roomsController.getAll();

  res.status(200).json(rooms);
});

roomsRouter.get("/:id", (req, res) => {
  const room = roomsController.get(req.params.id);
  if (room) {
    res.status(200).json(room);
  }
  res.status(404).json({ error: "Room not found." });
});

roomsRouter.post("/", (req, res) => {
  const { username } = req.body;
  if (username) {
    const creator = usersController.create(username); // Register the user
    const newRoom = roomsController.create(creator); // Create a new room
    res.status(201).json({ user: creator, room: newRoom });
  } else {
    res.status(400).json({ error: "Invalid or missing creator." });
  }
});

roomsRouter.post("/:id", (req, res) => {
  const roomId = req.params.id;
  const { username } = req.body;
  if (username) {
    const newPlayer = usersController.create(username); // Register the user
    const roomToJoin = roomsController.get(roomId);
    if (roomToJoin) {
      const updatedRoom = roomsController.add(roomToJoin.id, newPlayer);
      res.status(201).json({ room: updatedRoom });
    }
    res.status(404).json({ error: "Invalid or missing room id." });
  } else {
    res.status(400).json({ error: "Invalid or missing player" });
  }
});

export default roomsRouter;
