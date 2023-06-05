import mongoose, { Schema, Types } from 'mongoose';

import Message, { IMessage } from './Message.model';

Message.discriminator('Channel', new Schema({
  roomId: { type: Types.ObjectId, required: true, refPath: '' },
  senderId: { type: Types.ObjectId, required: true, ref: 'User' },
}));

const MessageDirect = mongoose.model<IMessage>('MessageChannel');

export default MessageDirect;