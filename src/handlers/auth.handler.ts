import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import authService from '../services/auth.service';

const authenticate = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => {
    const token = socket.handshake.auth.token as string | undefined;

    if (!token) return next(new Error('Authentication failed.'));
  
    const user = authService.verifyAccessToken(token);

    if (!user) return next(new Error('Authentication failed.'));

    socket.user = user;

    next(); 
};

const verifyToken = (token: string) => {
  const user = authService.verifyAccessToken(token);

  return user;
}

export default {
  authenticate,
  verifyToken,
};