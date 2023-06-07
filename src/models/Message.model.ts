import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IMessage extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  body: string;
  attachments: string[];
  createdAt: Date;
  updatedAt?: Date;
  reactions: {
    name: string,
    count: number,
    emojiId?: Types.ObjectId,
    url?: string,
    emoji?: string,
  }[];
}

const reactionCountSchema = new Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  emojiId: { type: Types.ObjectId, ref: 'CustomEmoji' },
  url: { type: String },
  emoji: { type: String },
});

const messageSchema = new Schema({
  body: { type: String, required: true },
  attachments: [{ type: String }],
  reactions: [{ type: reactionCountSchema }],
},
{
  timestamps: true,
  discriminatorKey: 'type',
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;