import { customAlphabet } from "nanoid";
import consola from "consola";
import { Player, Room } from "../config/types";
import rooms from "../database/rooms";
import playersController from "./playersController";

const nanoid = customAlphabet("1234567890abcdef", 8);

const roomsController = {
  getAll() {
    return rooms;
  },
  get(id: string) {
    return rooms.find((r) => r.id === id);
  },
  create(creator: Player) {
    const newRoom: Room = {
      id: nanoid(),
      players: [creator],
    };
    rooms.push(newRoom);
    consola.success(
      `[rooms] ~ A new room with id ${newRoom.id} has been created by ${creator.username}`
    );
    return newRoom;
  },
  addPlayer(roomId: string, player: Player) {
    const room = rooms.find((r) => r.id === roomId);
    const playerToAdd = playersController.getOne(player.id);
    if (room && playerToAdd) {
      playerToAdd.roomId = room?.id;
      room?.players.push(playerToAdd);
      consola.success(
        `[rooms] ~ The player ${player.username} has joined the game ${roomId}`
      );
    }
    return room;
  },
  removePlayer(roomId: string, playerId: string) {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      room.players = room.players.filter((p) => p.id === playerId);
    }
    return room;
  },
  delete(id: string) {
    const roomIndex = rooms.findIndex((r) => r.id === id);
    rooms.splice(roomIndex, 1);
    return rooms;
  },
  deleteAll() {
    rooms.splice(0, rooms.length);
    return rooms;
  },
};

export default roomsController;
