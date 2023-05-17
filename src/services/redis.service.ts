import redisClient from '../config/redis.config';

const get = async (key: string) => {
  await redisClient.connect();
  const result = await redisClient.get(key);
  await redisClient.disconnect();

  return result;
}

const set = async (
  key: string,
  value: string | number,
  expTime?: number
) => {
  await redisClient.connect();

  const opts = expTime ? {
    EX: Math.round(expTime / 1000),
  } : {};

  await redisClient.set(key, value, opts);
  await redisClient.disconnect();
};

const del = async (key: string) => {
  await redisClient.connect();
  await redisClient.del(key);
  await redisClient.disconnect();
}

export default {
  set,
  get,
  del,
}