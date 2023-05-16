import { Socket } from 'socket.io';

import ms from 'ms';

import env from '../config/env.config';

import SessionHandler from '../handlers/session.handler';

const checkSessionValidity = (socket: Socket) => {
  setInterval(async () => {
    const session = await SessionHandler.get(socket.user._id);
    if (!session) socket.disconnect(true);
  }, ms(env.JWT_ACCESS_EXPIRE));
}

export default checkSessionValidity;
