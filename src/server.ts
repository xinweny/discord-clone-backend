import { createServer } from 'http';
import { Server } from 'socket.io';

import socketIo from './listeners/index';

import app from './app';

const server = createServer(app);
export const io = new Server(server);

socketIo(io);

server.on('error', () => console.log('Error opening server'));

export default server;