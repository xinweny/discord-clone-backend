import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import env from '../config/env.config';

import UserToken from '../models/UserToken.model';
import { IUser } from '../models/User.model';

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, Number(env.SALT_LENGTH));
};

const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
}

const generateTokens = async (user: IUser) => {
  const { _id, username, role } = user;

  const payload = { _id, username, role };

  const accessToken = jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRE }
  );

  const refreshToken = jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRE }
  );
  
  const userToken = await UserToken.findOne({ userId: user._id });
  if (userToken) await UserToken.deleteOne();

  await new UserToken({ userId: user._id, token: refreshToken }).save();

  return { accessToken, refreshToken };
}

export default {
  hashPassword,
  verifyPassword,
  generateTokens,
};