import { Socket } from 'socket.io';

import RedisService from '../services/redis.service';

const get = async (userId: string) => {
  const data = await RedisService.get(`${userId}_SESSION`);

  return data ? JSON.parse(data) : null;
}

const set = async (socket: Socket, token: string, expiry: number) => {
  const session = {
    sessionId: socket.id,
    token,
  };

  const json = JSON.stringify(session);

  await RedisService.set(`${socket.user._id}_SESSION`, json, (expiry * 1000) - Date.now());
};

const remove = async (userId: string) => {
  await RedisService.del(`${userId}_SESSION`);
}

export default {
  get,
  set,
  remove,
};