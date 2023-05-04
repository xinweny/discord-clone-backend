import mongoose from 'mongoose';
import ms from 'ms';

import env from '../config/env.config';

const Schema = mongoose.Schema;

export interface IToken {
  _id: string;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const userTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: ms(env.JWT_REFRESH_EXPIRE),
  },
});

const UserToken = mongoose.model('UserToken', userTokenSchema, 'user_tokens');

export default UserToken;