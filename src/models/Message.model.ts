import mongoose, { Schema, Types, Document } from 'mongoose';

import attachmentSchema, { IAttachment } from './Attachment.schema';
import reactionCountSchema, { IReactionCount } from './ReactionCount.schema';

export interface IMessage extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  serverId?: Types.ObjectId;
  body: string;
  attachments: Types.DocumentArray<IAttachment>;
  createdAt: Date;
  updatedAt?: Date;
  reactionCounts: Types.DocumentArray<IReactionCount>;
}

const messageSchema = new Schema({
  body: { type: String, required: true },
  attachments: { type: [attachmentSchema], default: [] },
  reactionCounts: { type: [reactionCountSchema], default: [] },
},
{
  timestamps: true,
  discriminatorKey: 'type',
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;