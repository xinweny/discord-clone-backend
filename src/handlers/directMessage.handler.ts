import { Socket } from 'socket.io';

import { io } from '../server';


class DirectMessageHandler {
  userId: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.userId = socket.user._id;
  }
}

export default DirectMessageHandler;