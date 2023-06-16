import { Schema, Types } from 'mongoose';

interface IReactionCount extends Types.Subdocument {
  name: string,
  count: number,
  emojiId?: Types.ObjectId,
  url?: string,
  emoji?: string,
}

export { IReactionCount };

const reactionCountSchema = new Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  emojiId: { type: Types.ObjectId, ref: 'CustomEmoji' },
  url: { type: String },
  emoji: { type: String },
});

export default reactionCountSchema;