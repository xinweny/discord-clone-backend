import mongoose, { Types, Document } from 'mongoose';

export interface IServerInvite extends Document {
  urlId: string;
  url: string;
  serverId: Types.ObjectId;
}

const serverInviteSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  serverId: { type: Types.ObjectId, ref: 'Server', required: true, unique: true },
});

serverInviteSchema.virtual('urlId').get(function() {
  return this.url.split('/').slice(-1)[0];
});

const ServerInvite = mongoose.model<IServerInvite>('Url', serverInviteSchema, 'server_invites');

export default ServerInvite;