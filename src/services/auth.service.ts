import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
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

  const payload = { uid: _id, username, email, role };

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
  
  await RedisService.set(`${payload.uid}_REFRESH`, refreshToken, ms(env.JWT_REFRESH_EXPIRE));

  return { accessToken, refreshToken };
}

const verifyRefreshToken = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;

  const userToken = await RedisService.get(`${payload.uid.toString()}_REFRESH`);

  return (userToken === refreshToken) ? payload : null;
};

const issueAccessToken = (payload: {
  uid: string,
  email: string,
  username: string,
  role: string,
}) => {
  return jwt.sign(payload, env[`JWT_ACCESS_SECRET`], {
    expiresIn: env.JWT_ACCESS_EXPIRE,
  });
}

const deleteRefreshToken = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;

  if (payload) await RedisService.del(payload.uid);
};

const issueResetToken = async (userId: string) => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hash = await bcrypt.hash(resetToken, Number(env.BCRYPT_SALT));
  
  await RedisService.set(`${userId}_RESET`, hash, 1800000);

  return resetToken;
}

const verifyResetToken = async (resetToken: string, userId: string) => {
  const hashedToken = await RedisService.get(`${userId}_RESET`);

  if (!hashedToken) return null;

  const isValid = await bcrypt.compare(resetToken, hashedToken);

  if (!isValid) return null;

  const refreshToken = await RedisService.get(`${userId}_REFRESH`);

  return refreshToken;
}

export default {
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyRefreshToken,
  issueAccessToken,
  issueResetToken,
  deleteRefreshToken,
  verifyResetToken,
};