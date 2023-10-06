import { customAlphabet } from "nanoid";
import { Player, Room } from "../types";
import rooms from "../store/rooms";

const nanoid = customAlphabet("1234567890abcdef", 8);

export const roomsController = {
  getAll() {
    return rooms;
  },
  get(id: string) {
    return rooms.find((r) => r.id === id);
  },
  create() {
    const newRoom: Room = {
      id: nanoid(),
      status: "LOBBY",
      players: [],
    };
    rooms.push(newRoom);
    return newRoom;
  },
  addPlayer(roomId: string, player: Player) {
    const room = rooms.find((r) => r.id === roomId);
    room?.players.push(player);
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
