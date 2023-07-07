import 'dotenv/config';

import checkEmptyEnv from '../utils/checkEmptyEnv';

const ENVIRONMENT_VARIABLES: string[] = [
  'HOST',
  'PORT',
  'CLIENT_URL',
  'REDIS_URL',
  'MONGODB_URI',
  'BCRYPT_SALT',
  'JWT_ACCESS_SECRET',
  'JWT_ACCESS_EXPIRE',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRE',
  'JWT_RESET_SECRET',
  'SMTP_SERVICE',
  'SMTP_EMAIL',
  'SMTP_PASSWORD',
  'CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'BASE_SHORT_URL',
  'NODE_ENV',
];

checkEmptyEnv(ENVIRONMENT_VARIABLES);

const env: { [key: string]: string } = ENVIRONMENT_VARIABLES.reduce(
  (acc, envVar) =>  ({ ...acc, [envVar]: process.env[envVar] }),
  {},
);

export default env;