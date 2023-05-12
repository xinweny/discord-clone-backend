import { Socket } from 'socket.io';

import { io } from '../server';

import MessageService from '../services/message.service';

class MessageHandler {
  userId: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.userId = socket.user._id;
  }

  async getHistory(roomId: string) {
    const messages = await MessageService.get({ roomId });

    this.socket.emit(roomId, messages);
  }

  async sendDirectMessage(payload: {
    roomId: string,
    body: string,
    attachments?: string[],
  }) {
    const { roomId, body, attachments } = payload;

    const message = MessageService.create({
      senderId: this.userId,
      roomId,
      body,
      attachments,
    });

    io.in(roomId).emit(roomId, message);
    await MessageService.save(message);
  }

  async updateDirectMessage(payload: {
    roomId: string,
    messageId: string,
    fields: {
      body?: string,
      attachments?: string[],
    }
  }) {
    const { roomId, messageId, fields } = payload;

    const updatedMessage = await MessageService.update(messageId, fields);

    io.in(roomId).emit(roomId, updatedMessage);
  }
}

export default MessageHandler;