import { EventsMap } from "socket.io/dist/typed-events";
import { Player, Game } from ".";

export type ResponseStatus = "SUCCESS" | "ERROR";

export type AcknowledgementCallback = ({
  game,
  player,
}: {
  game?: Game;
  player?: Player;
}) => never;

export interface ClientToServerEvents extends EventsMap {
  CREATE_GAME: () => void;
  JOIN_GAME: (gameId: string, callback: AcknowledgementCallback) => void;
}

export interface ServerToClientEvents extends EventsMap {
  noArg: () => void;
  GAME_UPDATED: ({ game }: { game: Game }) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToServerEvents extends EventsMap {}

export interface SocketData {
  game?: Game;
  player?: Player;
}
