import { createServer } from 'http';
import { Server } from 'socket.io';
import addListeners from './listeners/index';

import app from './app';

const server = createServer(app);
const io = new Server(server);

addListeners(io);

server.on('error', () => console.log('Error opening server'));

export default server;