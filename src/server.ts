import { createServer } from 'http';
import { Server } from 'socket.io';
import { JwtPayload } from 'jsonwebtoken';

import socketIo from './config/socketio.config';

import app from './app';

const server = createServer(app);

declare module 'socket.io' {
  interface Socket {
    user: JwtPayload,
  }
}

export const io = new Server(server);

socketIo(io);

server.on('error', () => console.log('Error opening server'));

export default server;