import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import env from '../config/env.config';

import UserToken from '../models/UserToken.model';
import { IToken } from '../models/UserToken.model';
import { IUser } from '../models/User.model';

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
  
  const userToken = await UserToken.findOne({ userId: user._id });
  if (userToken) await UserToken.findByIdAndDelete(userToken._id);

  await new UserToken({ userId: user._id, token: refreshToken }).save();

  return { accessToken, refreshToken };
}

const verifyRefreshToken = async (refreshToken: string) => {
  const userToken = await UserToken.findOne({ token: refreshToken });

  if (!userToken) return false;

  const decodedToken = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as IToken;

  return decodedToken;
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
  const userToken = await UserToken.findOne({ token: refreshToken });

  if (userToken) await UserToken.findByIdAndDelete(userToken._id);
};

export default {
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyRefreshToken,
  issueAccessToken,
  deleteRefreshToken,
};