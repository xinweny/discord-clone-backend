import { Socket } from 'socket.io';

import SessionService from '../services/session.service';

class SessionHandler {
  userId: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.userId = socket.user._id;
  }

  async setSession() {
    const { token } = this.socket.handshake.query;
  
    if (!token) throw new Error('Access token not provided.');
  
    const session = await SessionService.set(this.socket);
  
    return session;
  }

  async removeSession() {
    await SessionService.remove(this.userId);
  }
}

export default SessionHandler;