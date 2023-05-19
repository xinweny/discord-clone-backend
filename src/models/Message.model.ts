import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IMessage extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  body: string;
  attachments: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema({
  roomId: { type: Types.ObjectId, required: true, refPath: 'roomType' },
  senderId: { type: Types.ObjectId, required: true, refPath: 'userType' },
  body: { type: String, required: true },
  attachments: [{ type: String }],
  roomType: { type: String, required: true, enum: ['DirectMessage', 'Channel'] },
  userType: { type: String, required: true, enum: ['User', 'ServerMember'] },
  reactions: {
    type: Map,
    of: Number,
    default: {},
  },
},
{
  timestamps: true,
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;