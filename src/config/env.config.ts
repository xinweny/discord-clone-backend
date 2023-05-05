import 'dotenv/config';

import checkEmptyEnv from '../utils/checkEmptyEnv';

const ENVIRONMENT_VARIABLES: string[] = [
  'HOST',
  'PORT',
  'REDIS_URL',
  'MONGODB_URI',
  'BCRYPT_SALT',
  'JWT_ACCESS_SECRET',
  'JWT_ACCESS_EXPIRE',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRE',
];

checkEmptyEnv(ENVIRONMENT_VARIABLES);

interface ProcessEnv { [key: string]: string }

const env: ProcessEnv = ENVIRONMENT_VARIABLES.reduce(
  (acc, envVar) =>  ({ ...acc, [envVar]: process.env[envVar] }),
  {},
);

export default env;