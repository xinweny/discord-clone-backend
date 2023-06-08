import mongoose, { Schema, Types } from 'mongoose';

const relationshipSchema = new Schema({
  fromUserId: { type: Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'friends', 'blocked_to', 'blocked_from', 'blocked_both'],
    default: 'pending',
  },
});

const Relationship = mongoose.model('Relationship', relationshipSchema);

export default Relationship;