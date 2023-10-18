export type User = {
  id: string;
  username?: string;
  socketId?: string;
}

export type Player = User & {
  color?: "" | "red" | "orange" | "yellow";
};

export type Room = {
  id: string;
  status: "UNINITIALIZED" | "INITIALIZED" | "LOBBY" | "IN_GAME";
  players: Player[];
};
