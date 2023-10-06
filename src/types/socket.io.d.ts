export {};
declare module "socket.io" {
  interface Socket {
    sessionId: string;
    userId: string;
    username: string;
  }
}
