import mongoose from 'mongoose';
import ms from 'ms';

import env from '../config/env.config';

const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: ms(env.JWT_REFRESH_EXPIRE),
  },
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

export default UserToken;