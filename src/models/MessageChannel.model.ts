import mongoose, { Schema, Types } from 'mongoose';

import Message, { IMessage } from './Message.model';

Message.discriminator('channel', new Schema({
  roomId: { type: Types.ObjectId, required: true, refPath: 'Server.channels' },
  serverId: { type: Types.ObjectId, required: true, ref: 'Server' }
}));

const MessageChannel = mongoose.model<IMessage>('channel');

export default MessageChannel;