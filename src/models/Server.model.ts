import mongoose, { Schema, Types } from 'mongoose';

const channelSchema = new Schema({
  name: { type: String, required: true, length: { max: 32 } },
  category: { type: String },
  accessBy: [{
    memberId: { type: Types.ObjectId, ref: 'ServerMember' },
  }],
});

const serverSchema = new Schema({
  creatorId: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, length: { max: 32 } },
  roles: [{ type: String }],
  categories: [{ type: String }],
  channels: [{ type: channelSchema, required: true }],
  imageUrl: { type: String },
  public: { type: Boolean, default: true },
});

serverSchema.pre('save', function (next) {
  this.roles = [...new Set(this.roles)];
  this.categories = [...new Set(this.categories)];
  next();
});

const Server = mongoose.model('Server', serverSchema);

export default Server;