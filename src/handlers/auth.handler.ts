import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import AuthService from '../services/auth.service';

const authenticate = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => {
    const accessToken = socket.handshake.query.accessToken as string | undefined; // Change to auth later

    if (!accessToken) return next(new Error('Authentication failed.'));
  
    const user = AuthService.verifyAccessToken(accessToken);

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