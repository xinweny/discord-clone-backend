import mongoose, { Schema, Types, Document } from 'mongoose';

import reactionCountSchema from './ReactionCount.schema';

export interface IMessage extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  serverId?: Types.ObjectId;
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