type Color = "" | "red" | "green" | "blue";
export interface Player {
  id: string;
  username: string;
  color?: Color;
  socketId?: string;
}
export interface Room {
  id: string;
  colors?: {
    taken: Color[];
  };
  players: Player[];
}
