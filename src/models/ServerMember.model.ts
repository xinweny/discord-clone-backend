import mongoose, { Schema, Types } from 'mongoose';

const serverMemberSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  serverId: { type: Types.ObjectId, ref: 'Server', required: true },
  username: { type: String, required: true },
  avatarUrl: { type: String },
  roles: { type: [Types.ObjectId], ref: 'Server.roles' },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

const ServerMember = mongoose.model('Server', serverMemberSchema);

export default ServerMember;