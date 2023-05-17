import { Socket } from 'socket.io';
import ms from 'ms';

import env from '../config/env.config';

import SessionService from '../services/session.service';

class SessionHandler {
  userId: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.userId = socket.user._id;
  }

  async setSession() {
    const { accessToken } = this.socket.handshake.query;
  
    if (!accessToken) throw new Error('Access token not provided.');
  
    const session = await SessionService.set(this.socket, accessToken as string);
  
    return session;
  }

  async refreshSession(token: string) {
    const session = await SessionService.set(this.socket, token);

    return session;
  }

  async checkSessionValidity() {
    setInterval(async () => {
      const session = await SessionService.get(this.userId);
      if (!session) this.socket.disconnect();
    }, ms(env.JWT_ACCESS_EXPIRE));
  }

  async removeSession() {
    await SessionService.remove(this.userId);
  }
}

export default SessionHandler;