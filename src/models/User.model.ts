import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: Boolean, default: false },
  joinedAt: { type: Date, required: true },
  avatarUrl: { type: String },
  servers: [{
    _id: { type: Schema.Types.ObjectId, ref: 'Server' },
    name: { type: String, required: true },
    imgUrl: { type: String },
  }],
});

const User = mongoose.model('User', UserSchema);

export default User;