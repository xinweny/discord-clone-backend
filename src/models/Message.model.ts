import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  body: string;
  attachments: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema({
  chatId: { type: Types.ObjectId, required: true },
  senderId: { type: Types.ObjectId, required: true },
  body: { type: String, required: true },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

messageSchema.virtual('userSender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
});

messageSchema.virtual('serverMemberSender', {
  ref: 'ServerMember',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
});

messageSchema.virtual('direct', {
  ref: 'Channel',
  localField: 'chatId',
  foreignField: '_id',
  justOne: true,
});

messageSchema.virtual('channel', {
  ref: 'DirectMessage',
  localField: 'chatId',
  foreignField: '_id',
  justOne: true,
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;