import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  verified: boolean;
  joinedAt: Date;
  avatarUrl?: string;
  role: string;
}

export interface IReqUser extends Document {
  email: string;
  username: string;
  verified: boolean;
  role: string;
}

const userSchema = new Schema({
  username: { type: String, required: true, length: { max: 32 } },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true, select: false, unique: true },
  verified: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  avatarUrl: { type: String },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;