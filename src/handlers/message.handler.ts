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

    await MessageService.save(message);
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

    const updatedMessage = MessageService.create({
      _id: messageId,
      roomId: message.roomId,
      senderId: message.senderId,
      updatedAt: new Date(),
      body: fields.body || message.body,
      attachments: fields.attachments || message.attachments,
      createdAt: message.createdAt,
    });

    io.to(roomId).emit(roomId, updatedMessage);

    await MessageService.save(updatedMessage);
  }
}

export default MessageHandler;