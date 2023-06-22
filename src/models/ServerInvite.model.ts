import mongoose, { Document } from 'mongoose';

export interface IServerInvite extends Document {
  urlId: string;
  origUrl: string;
  shortUrl: string;
  clicks: number;
}

const serverInviteSchema = new mongoose.Schema({
  urlId: { type: String, required: true },
  origUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, required: true, default: 0 },
});

const ServerInvite = mongoose.model<IServerInvite>('Url', serverInviteSchema, 'server_invites');

export default ServerInvite;