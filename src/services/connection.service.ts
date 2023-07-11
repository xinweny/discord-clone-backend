import { Socket } from 'socket.io';

import redisService from './redis.service';

const get = async (userId: string) => {
  const data = await redisService.get(`${userId}_CONNECTION`);

  return data;
}

const set = async (socket: Socket) => {
  await redisService.set(`${socket.user._id}_CONNECTION`, socket.id);
};

const remove = async (userId: string) => {
  await redisService.del(`${userId}_CONNECTION`);
}

export default {
  get,
  set,
  remove,
};