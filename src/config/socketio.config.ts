import { Server } from 'socket.io';

import connectionHandler from '../handlers/connection.handler';
import authHandler from '../handlers/auth.handler';

const socketIo = (io: Server) => {
  io
    .use(authHandler.authenticate)
    .on('connection', connectionHandler)
    .on('error', () => console.log('Error opening server'));
}

export default socketIo;