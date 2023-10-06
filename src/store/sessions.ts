export type SessionData = {
  userId: string;
  username: string;
};

class SessionStore {
  sessions: Map<string, SessionData>;

  constructor() {
    this.sessions = new Map();
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: SessionData) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

export const sessionStore = new SessionStore();
