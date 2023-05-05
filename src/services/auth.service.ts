import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';

import env from '../config/env.config';

import { IUser } from '../models/User.model';

import RedisService from './redis.service';

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, Number(env.BCRYPT_SALT));
};

const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
}

const generateTokens = async (user: IUser) => {
  const { _id, username, email, role } = user;

  const payload = { _id, username, email, role };

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

  console.log(ms(env.JWT_REFRESH_EXPIRE));
  
  await RedisService.set(user._id.toString(), refreshToken, ms(env.JWT_REFRESH_EXPIRE));

  return { accessToken, refreshToken };
}

const verifyRefreshToken = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;

  const userToken = await RedisService.get(payload._id);

  if (userToken !== refreshToken) return false;

  return payload;
};

const issueAccessToken = (payload: {
  _id: string,
  email: string,
  username: string,
  role: string,
}) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRE,
  });
}

const deleteRefreshToken = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;

  if (payload) await RedisService.del(payload._id);
};

export default {
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyRefreshToken,
  issueAccessToken,
  deleteRefreshToken,
};