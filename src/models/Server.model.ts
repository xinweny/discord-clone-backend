import mongoose, { Schema, Types } from 'mongoose';

const serverSchema = new Schema({
  creatorId: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, length: { max: 32 } },
  roles: [{ type: String }],
  channelCategories: [{ type: String }],
  channels: [{ type: Types.ObjectId, ref: 'Channel' }],
  imageUrl: { type: String },
  public: { type: Boolean, default: true },
});

serverSchema.pre('save', function (next) {
  this.roles = [...new Set(this.roles)];
  this.channelCategories = [...new Set(this.channelCategories)];
  next();
})

const Server = mongoose.model('Server', serverSchema);

export default Server;