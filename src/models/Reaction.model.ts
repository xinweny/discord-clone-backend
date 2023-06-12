import mongoose, { Schema, Types } from 'mongoose';

export interface IReaction {
  _id: Types.ObjectId;
  reactorId: Types.ObjectId;
  messageId: Types.ObjectId;
  emojiId?: Types.ObjectId;
  emoji?: string;
}

const reactionSchema = new Schema({
  reactorId: { type: Schema.Types.ObjectId, required: true },
  messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
  emojiId: { type: Schema.Types.ObjectId, ref: 'CustomEmoji' },
  emoji: { type: 'String' },
});

const Reaction = mongoose.model('Reaction', reactionSchema);

export default Reaction;