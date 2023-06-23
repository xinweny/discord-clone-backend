import mongoose, { Schema, Types } from 'mongoose';

import Message, { IMessage } from './Message.model';

Message.discriminator('direct', new Schema({
  roomId: { type: Types.ObjectId, required: true, ref: 'DM' },
}));

const MessageDirect = mongoose.model<IMessage>('direct');

export default MessageDirect;