import { v4 as uuidv4 } from "uuid";
import consola from "consola";
import players from "../database/players";
import { Player } from "../config/types";

const playersController = {
  getAll: () => {
    return players;
  },
  getOne: (id: string) => {
    return players.find((player) => player.id === id);
  },
  getBySocketId: (socketId: string) => {
    return players.find((player) => player.socketId === socketId);
  },
  create: (username: string) => {
    const id = uuidv4();
    const newPlayer: Player = {
      username,
      id,
    };
    players.push(newPlayer);
    consola.success(
      `[players] ~ A new player with username ${newPlayer.username} has been registered.`
    );
    // TODO : Link a socket id to the player object
    return newPlayer;
  },
  delete: (id: string) => {
    const playerIndex = players.findIndex((player) => player.id === id);
    players.splice(playerIndex, 1);
    return players;
  },
  deleteAll: () => {
    players.splice(0, players.length);
    return players;
  },
};

export default playersController;
