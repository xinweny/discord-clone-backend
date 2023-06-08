import mongoose, { Schema, Types } from 'mongoose';

const serverMemberSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  serverId: { type: Types.ObjectId, ref: 'Server', required: true },
  displayName: { type: String, required: true },
  roles: { type: [Types.ObjectId], ref: 'Server.roles', default: [] },
  bio: { type: String, default: '', length: { max: 190 } },
  bannerColor: { type: String, default: '' },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'server_members',
});

const ServerMember = mongoose.model('ServerMember', serverMemberSchema);

export default ServerMember;