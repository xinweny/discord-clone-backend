import { Server, Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';

import env from './env.config';

import MessageHandler from '../handlers/message.handler';

const socketIo = (io: Server) => {
  io
  .use((socket: Socket, next) => {
      const accessToken = socket.handshake.query.accessToken as string | undefined;

      if (!accessToken) return next(new Error('Authentication error'));
  
      const user = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as JwtPayload;
  
      socket.user = user;
      next();
  })
  .on('connection', (socket: Socket) => {
    const messageHandler = new MessageHandler(socket);

    socket.on('friend_request:join', () => socket.join(`${socket.user._id}_friend_requests`));
    socket.on('friend_request:join', () => socket.join(`${socket.user._id}_friend_statuses`));
    socket.on('chat:join', (chatId: string) => socket.join(chatId));

    socket.on('message:send', (payload) => messageHandler.sendDirectMessage(payload));
    socket.on('message:update', (payload) => messageHandler.updateDirectMessage(payload));

    socket.on('disconnect', () => console.log(`${new Date}: ${socket.id} disconnected`));

    socket.on('error', (err) => console.log(err));
  });
}

export default socketIo;