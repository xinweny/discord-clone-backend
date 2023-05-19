import mongoose, { Schema } from 'mongoose';

const reactionSchema = new Schema({
  reactorId: { type: Schema.Types.ObjectId, required: true },
  messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
  emojiId: { type: Schema.Types.ObjectId, ref: 'CustomEmoji' },
  emoji: { type: 'String' },
});

const Reaction = mongoose.model('Reaction', reactionSchema);

export default Reaction;