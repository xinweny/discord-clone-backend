import { createClient } from 'redis';

import env from './env.config';

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export default redisClient;