import { Socket } from 'socket.io';

import RedisService from './redis.service';

const get = async (userId: string) => {
  const data = await RedisService.get(`${userId}_SESSION`);

  return data;
}

const set = async (socket: Socket) => {
  await RedisService.set(`${socket.user._id}_SESSION`, socket.id);
};

const remove = async (userId: string) => {
  await RedisService.del(`${userId}_SESSION`);
}

export default {
  get,
  set,
  remove,
};