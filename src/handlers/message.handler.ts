import { Socket } from 'socket.io';

import { io } from '../server';

class MessageHandler {
  userId: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.userId = socket.user._id;
  }
  
  async sendMessage(message: {
    _id: string,
    roomId: string,
    body: string,
    attachments?: string[],
  }) {
    const { roomId } = message;

    io.to(roomId).emit(roomId, message);
  }
}

export default MessageHandler;