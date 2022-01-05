import { Router } from "express";
import playersController from "../controller/playersController";
import roomsController from "../controller/roomsController";

const roomsRouter = Router();

roomsRouter.get("/:id", (req, res) => {
  const room = roomsController.get(req.params.id);
  if (room) {
    res.status(200).json(room);
  }
  res.status(404).json({ error: "Room not found." });
});

roomsRouter.get("/", (req, res) => {
  const rooms = roomsController.getAll();

  return res.status(200).json(rooms);
});

roomsRouter.post("/:id", (req, res) => {
  const roomId = req.params.id;
  const { username } = req.body;
  if (username) {
    const newPlayer = playersController.create(username); // Register the user
    const roomToJoin = roomsController.get(roomId);
    if (roomToJoin) {
      const updatedRoom = roomsController.add(roomToJoin.id, newPlayer);
      return res.status(201).json({ user: newPlayer, room: updatedRoom });
    }
    return res.status(404).json({ error: "Invalid or missing room id." });
  }
  return res.status(400).json({ error: "Invalid or missing player" });
});

roomsRouter.post("/", (req, res) => {
  const { username } = req.body;
  if (username) {
    const creator = playersController.create(username); // Register the user
    const newRoom = roomsController.create(creator); // Create a new room
    return res.status(201).json({ user: creator, room: newRoom });
  }
  return res.status(400).json({ error: "Invalid or missing creator." });
});

roomsRouter.delete("/:id", (req, res) => {
  console.log("Request recieved");
  const roomId = req.params.id;
  const room = roomsController.get(roomId);
  if (room) {
    const updatedRooms = roomsController.delete(roomId);
    console.log(
      "🚀 ~ file: roomsRouter.ts ~ line 53 ~ roomsRouter.delete ~ updatedRooms",
      updatedRooms
    );
    return res.status(200).json({
      message: `The room with id '${roomId}' has been deleted.`,
      rooms: updatedRooms,
    });
  }
  return res.status(404).json({ error: "Unable to find the room." });
});

roomsRouter.delete("/", (req, res) => {
  const updatedRooms = roomsController.deleteAll();
  return res
    .status(204)
    .json({ message: "All rooms have been deleted.", rooms: updatedRooms });
});

export default roomsRouter;
