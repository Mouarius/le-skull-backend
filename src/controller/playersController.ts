import { v4 as uuidv4 } from "uuid";
import players from "../store/players";
import { Player } from "../types";

class PlayersController {
  getAll() {
    return players;
  }
  getOne(id: string) {
    return players.find((player) => player.id === id);
  }
  getBySocketId(socketId: string) {
    return players.find((player) => player.socketId === socketId);
  }
  create(username?: string) {
    const id = uuidv4();
    const newPlayer: Player = {
      username: username,
      id,
    };
    players.push(newPlayer);
    return newPlayer;
  }
  update(id:string, newPlayer: Player) {
    const player = this.getOne(id)
    if (!player) throw new Error("Player not found")
    player.username = newPlayer.username
    return player
  }
  delete(id: string) {
    const playerIndex = players.findIndex((player) => player.id === id);
    players.splice(playerIndex, 1);
    return players;
  }
  deleteAll() {
    players.splice(0, players.length);
    return players;
  }
}

export const playersController = new PlayersController()

