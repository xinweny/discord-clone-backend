import bcrypt from 'bcryptjs';

import env from '../config/env.config';

const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, Number(env.SALT_LENGTH));

  return hashedPassword;
};

export default {
  hashPassword,
};