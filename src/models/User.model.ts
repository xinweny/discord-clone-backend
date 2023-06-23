import mongoose, { Types, Schema, Document } from 'mongoose';

import CustomError from '../helpers/CustomError';
import relationSchema, { IRelation } from './Relation.schema';

export interface IUser extends Document {
  username: string;
  displayName: string;
  password: string;
  email: string;
  verified: boolean;
  avatarUrl?: string;
  customStatus?: string;
  role: string;
  relations: Types.DocumentArray<IRelation>;
  bio: string;
  bannerColor: string;
  relationTo(userId: Types.ObjectId | string): IRelation | undefined;
}

export interface IReqUser extends Document {
  email: string;
  username: string;
  verified: boolean;
  role: string;
}

const userSchema = new Schema({
  username: { type: String, required: true, length: { max: 32 }, unique: true },
  displayName: { type: String, required: true, length: { max: 32 } },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true, select: false, unique: true },
  verified: { type: Boolean, default: false, select: false },
  avatarUrl: { type: String },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
    select: false,
  },
  relations: { type: [relationSchema], default: [], select: false },
  bio: { type: String, default: '', length: { max: 190 } },
  customStatus: { type: String, length: { max: 128 } },
  bannerColor: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', function (next) {
  const userIds = this.relations.map(relation => relation.userId.toString());
  
  if ((new Set(userIds)).size !== userIds.length) throw new CustomError(400, 'Duplicate user IDs not allowed.');

  next();
});

userSchema.method(
  'relationTo',
  function (userId: Types.ObjectId | string) {
    return this.relations.find((relation: IRelation) => relation.userId.equals(userId));
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;