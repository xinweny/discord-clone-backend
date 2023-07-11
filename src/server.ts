import { createServer } from 'http';
import { Server } from 'socket.io';
import { JwtPayload } from 'jsonwebtoken';

import env from './config/env.config';

import socketIo from './config/socketio.config';

import app from './app';

const server = createServer(app);

declare module 'socket.io' {
  interface Socket {
    user: JwtPayload,
  }
}

export const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
  },
});

socketIo(io);

export default server;