import { Server } from 'socket.io';

import onConnection from './onConnection';

const socketIo = (io: Server) => {
  io.on('connection', onConnection);
}

export default socketIo;