import { Socket } from 'socket.io';
import ms from 'ms';

import RedisService from '../services/redis.service';
import env from '../config/env.config';

const get = async (userId: string) => {
  const data = await RedisService.get(`${userId}_SESSION`);

  return data ? JSON.parse(data) : null;
}

const set = async (socket: Socket, token: string) => {
  const session = {
    sessionId: socket.id,
    token,
  };

  const json = JSON.stringify(session);

  await RedisService.set(`${socket.user._id}_SESSION`, json, ms(env.JWT_ACCESS_EXPIRE));
};

const remove = async (userId: string) => {
  await RedisService.del(`${userId}_SESSION`);
}

export default {
  get,
  set,
  remove,
};