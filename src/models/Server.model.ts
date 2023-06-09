import mongoose, { Schema, Types } from 'mongoose';

import roleSchema from './Role.schema';
import categorySchema from './Category.schema';
import channelSchema from './Channel.schema';

const serverSchema = new Schema({
  creatorId: { type: Types.ObjectId, ref: 'ServerMember', required: true },
  name: { type: String, required: true, unique: true },
  roles: { type: [roleSchema], default: () => ([]) },
  categories: { type: [categorySchema] },
  channels: { type: [channelSchema] },
  imageUrl: { type: String },
  private: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

const Server = mongoose.model('Server', serverSchema);

export default Server;