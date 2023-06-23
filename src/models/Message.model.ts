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
  senderId: { type: Types.ObjectId, required: true, ref: 'User' },
  body: { type: String, required: true },
  attachments: { type: [attachmentSchema], default: [] },
  reactionCounts: { type: [reactionCountSchema], default: [] },
},
{
  timestamps: true,
  discriminatorKey: 'type',
});

messageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
});

messageSchema.virtual('serverMember', {
  ref: 'ServerMember',
  localField: 'senderId',
  foreignField: 'userId',
  justOne: true,
});

messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;