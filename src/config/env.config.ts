import 'dotenv/config';

import checkEmptyEnv from '../utils/checkEmptyEnv';

const ENVIRONMENT_VARIABLES: string[] = [
  'HOST',
  'PORT',
];

checkEmptyEnv(ENVIRONMENT_VARIABLES);

interface ProcessEnv { [key: string]: string }

const env: ProcessEnv = ENVIRONMENT_VARIABLES.reduce(
  (acc, envVar) =>  ({ ...acc, [envVar]: process.env[envVar] }),
  {},
);

export default env;