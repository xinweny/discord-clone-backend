import { Server, Socket } from 'socket.io';

import checkSessionValidity from '../helpers/checkSessionValidity';

import MessageHandler from '../handlers/message.handler';
import AuthHandler from '../handlers/auth.handler';
import SessionHandler from '../handlers/session.handler';

const socketIo = (io: Server) => {
  io
  .use(AuthHandler.authenticate)
  .on('connection', async (socket: Socket) => {
    await SessionHandler.set(
      socket,
      socket.handshake.query.accessToken as string,
    );

    const messageHandler = new MessageHandler(socket);

    socket.join(socket.user._id);

    socket.on('room:join', (roomId: string) => {
      socket.join(roomId);
      messageHandler.getHistory(roomId);
    });

    socket.on('message:send', (payload) => messageHandler.sendMessage(payload));
    socket.on('message:update', (payload) => messageHandler.updateMessage(payload));

    socket.on('token:refresh', async (token) => {
      const decoded = AuthHandler.verifyToken(token);
      if (decoded) await SessionHandler.set(socket, token);
    });

    socket.on('disconnect', () => console.log(`${new Date()}: ${socket.id} disconnected`));

    socket.on('error', (err) => socket.emit(socket.user._id, err));

    checkSessionValidity(socket);
  });
}

export default socketIo;