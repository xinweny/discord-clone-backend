import mongoose, { Schema, Types } from 'mongoose';

import Message, { IMessage } from './Message.model';

Message.discriminator('direct', new Schema({
  roomId: { type: Types.ObjectId, required: true, ref: 'DirectMessage' },
  senderId: { type: Types.ObjectId, required: true, ref: 'User' },
}));

const MessageDirect = mongoose.model<IMessage>('direct');

export default MessageDirect;