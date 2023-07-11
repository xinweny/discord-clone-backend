import redisClient from '../config/redis.config';

const get = async (key: string) => {
  const result = await redisClient.get(key);

  return result;
};

const getMany = async (keys: string[]) => {
  const result = await Promise.all(keys.map(
    key => redisClient.get(key)
  ));

  return result;
};

const set = async (
  key: string,
  value: string | number,
  expTime?: number
) => {
  const opts = expTime ? {
    EX: Math.round(expTime / 1000),
  } : {};

  await redisClient.set(key, value, opts);
};

const del = async (key: string) => {
  await redisClient.del(key);
};

export default {
  set,
  get,
  getMany,
  del,
}