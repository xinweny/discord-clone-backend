import mongoose, { Schema, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  verified: boolean;
  joinedAt: Date;
  avatarUrl?: string;
  role: string;
}

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true, select: false },
  verified: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  avatarUrl: { type: String },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user'
  },
});

const User = mongoose.model('User', userSchema);

export default User;