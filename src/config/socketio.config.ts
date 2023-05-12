import { Server, Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ExtendedError } from 'socket.io/dist/namespace';

import env from './env.config';

import MessageController from '../controllers/message.controller';

const socketIo = (io: Server) => {
  io
  .use((socket: Socket, next) => {
    try {
      const accessToken = socket.handshake.query.accessToken as string | undefined;

      if (!accessToken) throw new Error('Authentication error');
  
      const user = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as JwtPayload;
  
      socket.user = user;
      next();
    } catch (err) {
      return next(err as ExtendedError);
    }
  })
  .on('connection', (socket: Socket) => {
    const messageController = new MessageController(socket);
  
    socket.on('dm:join', (chatId: string) => socket.join(chatId));
    socket.on('dm:create', (payload) => messageController.sendDirectMessage(payload));
    socket.on('dm:update', (payload) => messageController.updateMessage(payload));

    socket.on('error', (err) => console.log(err));
  });
}

export default socketIo;