import mongoose, { Schema, Types } from 'mongoose';

interface IDirectMessage extends Document {
  creatorId: Types.ObjectId;
  participantIds: Types.ObjectId[];
  name: string;
}

export { IDirectMessage };

const directMessageSchema = new Schema({
  creatorId: { type: Types.ObjectId, ref: 'User', required: true },
  participantIds: { type: [Types.ObjectId], ref: 'User', required: true },
  name: { type: String, length: { min: 2, max: 32 }, trim: true },
});

directMessageSchema.pre('save', function (next) {
  this.participantIds = [this.creatorId, ...this.participantIds];
  next();
});

const DirectMessage = mongoose.model<IDirectMessage>('DirectMessage', directMessageSchema, 'direct_messages');

export default DirectMessage;