import { Socket } from 'socket.io';

import { io } from '../server';

import MessageService from '../services/message.service';

class MessageController {
  userId: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.userId = socket.user._id;
  }

  async sendDirectMessage(payload: {
    chatId: string,
    body: string,
    attachments?: string[],
  }) {
    const { chatId, body, attachments } = payload;
    
    const message = await MessageService.create(this.userId, chatId, body, attachments);

    io.sockets.in(chatId)
      .emit(chatId, message);
  }

  async updateMessage(payload: {
    chatId: string,
    messageId: string,
    fields: {
      body?: string,
      attachments: string[],
    }
  }) {
    const { chatId, messageId, fields } = payload;

    const updatedMessage = await MessageService.update(messageId, fields);

    io.sockets.in(chatId)
      .emit(chatId, updatedMessage);
  }
}

export default MessageController;