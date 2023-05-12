import { Socket } from 'socket.io';

class DirectMessageHandler {
  userId: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.userId = socket.user._id;
  }
}

export default DirectMessageHandler;