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
    const messages = await MessageService.getMany({ roomId });

    this.socket.emit(roomId, messages);
  }
  
  async sendMessage(payload: {
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

    io.to(roomId).emit(roomId, message);
  }

  async updateMessage(payload: {
    roomId: string,
    messageId: string,
    fields: {
      body?: string,
      attachments?: string[],
    }
  }) {
    const { roomId, messageId, fields } = payload;

    const message = await MessageService.getOne(messageId);

    if (!message) throw new Error('Message not found.');

    // TODO: implement emit updated message
  }
}

export default MessageHandler;