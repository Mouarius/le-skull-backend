export interface Player {
  id: string;
  username: string;
  color?: "" | "red" | "orange" | "yellow";
  socketId?: string;
}
export interface Room {
  id: string;
  players: Player[];
}
