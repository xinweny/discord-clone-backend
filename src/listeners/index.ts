import { Server } from 'socket.io';

import onConnection from './onConnection';

const addListeners = (io: Server) => {
  io.on('connection', onConnection);
}

export default addListeners;