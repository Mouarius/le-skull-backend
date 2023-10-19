import { customAlphabet } from "nanoid";
import { Player, Game } from "../types";
import games from "../store/games";

const nanoid = customAlphabet("1234567890abcdef", 8);

export const gamesController = {
  getAll() {
    return games;
  },
  get(id: string) {
    return games.find((r) => r.id === id);
  },
  create() {
    const newGame: Game = {
      id: nanoid(),
      status: "LOBBY",
      players: [],
    };
    games.push(newGame);
    return newGame;
  },
  addPlayer(roomId: string, player: Player) {
    const room = games.find((r) => r.id === roomId);
    room?.players.push(player);
    return room;
  },
  delete(id: string) {
    const roomIndex = games.findIndex((r) => r.id === id);
    games.splice(roomIndex, 1);
    return games;
  },
  deleteAll() {
    games.splice(0, games.length);
    return games;
  },
};
