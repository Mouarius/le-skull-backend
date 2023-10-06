export type Player = {
  id: string;
  username?: string;
  color?: "" | "red" | "orange" | "yellow";
  socketId?: string;
};

export type Room = {
  id: string;
  status: "UNINITIALIZED" | "INITIALIZED" | "LOBBY" | "IN_GAME";
  players: Player[];
};
