import { Socket } from 'socket.io';

import { io } from '../server';
import SessionService from '../services/session.service';

class DirectMessageHandler {
  userId: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.userId = socket.user._id;
  }

  async subscribe(payload: {
    roomId: string,
    participantIds: string[],
  }) {
    const { roomId, participantIds } = payload;

    const sessions = await Promise.all(
      participantIds.map(id => SessionService.get(id))
    );
    
    const sockets = sessions
      .filter(session => session !== null)
      .map(socketId => io.sockets.sockets.get(socketId as string));

    sockets.push(this.socket);

    for (const socket of sockets) {
      if (socket) socket.join(roomId);
    }
  }
}

export default DirectMessageHandler;