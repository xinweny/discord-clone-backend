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

const messageSchema = new Schema({
  roomId: { type: Types.ObjectId, required: true, refPath: 'roomType' },
  senderId: { type: Types.ObjectId, required: true, refPath: 'userType' },
  body: { type: String, required: true },
  attachments: [{ type: String }],
  roomType: { type: String, required: true, enum: ['DirectMessage', 'Channel'] },
  userType: { type: String, required: true, enum: ['User', 'ServerMember'] },
  reactions: [{
    name: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    emojiId: { type: Types.ObjectId, ref: 'CustomEmoji' },
    url: { type: String },
    emoji: { type: String },
  }],
},
{
  timestamps: true,
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;