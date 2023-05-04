import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  verified: { type: Boolean, default: false },
  joinedAt: { type: Date, required: true },
  avatarUrl: { type: String },
  role: { type: String, required: true, enum: ['user', 'admin', 'super_admin'], default: 'user' }
});

const User = mongoose.model('User', UserSchema);

export default User;