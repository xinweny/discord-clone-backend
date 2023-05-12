import mongoose, { Schema, Types } from 'mongoose';

const directMessageSchema = new Schema({
  creatorId: { type: Types.ObjectId, ref: 'User', required: true },
  participantIds: [{ type: Types.ObjectId, ref: 'User', required: true }],
  name: { type: String, length: { min: 2, max: 32 }, trim: true },
});

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema, 'direct_messages');

export default DirectMessage;