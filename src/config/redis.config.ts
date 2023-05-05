import { createClient } from 'redis';

import env from './env.config';

const redisClient = createClient({
  url: env.REDIS_URL,
});

export default redisClient;