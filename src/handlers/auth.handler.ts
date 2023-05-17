import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import AuthService from '../services/auth.service';

const authenticate = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => {
    const token = socket.handshake.query.token as string | undefined; // Change to auth later

    if (!token) return next(new Error('Authentication failed.'));
  
    const user = AuthService.verifyAccessToken(token);

    if (!user) return next(new Error('Authentication failed.'));

    socket.user = user;

    next(); 
}

const verifyToken = (token: string) => {
  const user = AuthService.verifyAccessToken(token);

  return user;
}

export default {
  authenticate,
  verifyToken,
}