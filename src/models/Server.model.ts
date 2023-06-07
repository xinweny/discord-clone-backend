import mongoose, { Schema, Types } from 'mongoose';

const channelSchema = new Schema({
  name: { type: String, required: true, length: { max: 32 } },
  category: { type: Types.ObjectId, refPath: 'categories' },
  type: { type: String, enum: ['text', 'voice'] },
});

const roleSchema = new Schema({
  name: { type: String, unique: true },
  color: { type: String },
  permissions: {
    read: [{ type: Types.ObjectId, refPath: 'channels' }],
    write: [{ type: Types.ObjectId, refPath: 'channels' }],
  },
});

const categorySchema = new Schema({
  name: { type: String, unique: true },
});

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