import { Schema, Types } from 'mongoose';

const reactionCountSchema = new Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  emojiId: { type: Types.ObjectId, ref: 'CustomEmoji' },
  url: { type: String },
  emoji: { type: String },
});

export default reactionCountSchema;