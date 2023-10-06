import { EventsMap } from "socket.io/dist/typed-events";
import { Player, Room } from ".";

export type ResponseStatus = "SUCCESS" | "ERROR";

export type AcknowledgementCallback = ({
  room,
  player,
}: {
  room?: Room;
  player?: Player;
}) => never;

export interface ClientToServerEvents extends EventsMap {
  CREATE_ROOM: () => void;
  JOIN_ROOM: (roomId: string, callback: AcknowledgementCallback) => void;
}

export interface ServerToClientEvents extends EventsMap {
  noArg: () => void;
  ROOM_UPDATED: ({ room }: { room: Room }) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToServerEvents extends EventsMap {}

export interface SocketData {
  room?: Room;
  player?: Player;
}
