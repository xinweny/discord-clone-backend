import { Server } from 'socket.io';

import connectionService from '../services/connection.service';
import authHandler from '../handlers/auth.handler';

const socketIo = (io: Server) => {
  io
    .use(authHandler.authenticate)
    .on('connection', async (socket) => {
      await connectionService.set(socket);
      console.log(`${socket.id} connected`);

      socket.on('disconnect', async () => {
        await connectionService.remove(socket.user._id);
        console.log(`${socket.id} disconnected`);
      });
    })
    .on('error', () => console.log('Error opening server'));
}

export default socketIo;