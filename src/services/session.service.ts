import { Socket } from 'socket.io';

import redisService from './redis.service';

const get = async (userId: string) => {
  const data = await redisService.get(`${userId}_SESSION`);

  return data;
}

const set = async (socket: Socket) => {
  await redisService.set(`${socket.user._id}_SESSION`, socket.id);
};

const remove = async (userId: string) => {
  await redisService.del(`${userId}_SESSION`);
}

export default {
  get,
  set,
  remove,
};