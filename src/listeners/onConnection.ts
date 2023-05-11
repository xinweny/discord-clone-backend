import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

import env from '../config/env.config';
import { IUser } from '../models/User.model';

import onJoinDirectMessage from './onJoinDirectMessage';
import onSendDirectMessage from './onSendDirectMessage';

const onConnection = (socket: Socket) => {
  const accessToken = socket.handshake.query.accessToken as string | undefined;

  if (!accessToken) return socket.disconnect();

  try {
    const user = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as IUser;

    socket.on('join_direct_message', onJoinDirectMessage(socket));
    socket.on('send_direct_message', onSendDirectMessage(user._id));
  } catch (err) {
    return socket.disconnect();
  }
};

export default onConnection;