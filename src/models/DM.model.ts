import mongoose, { Schema, Types } from 'mongoose';

export interface IDM extends Document {
  creatorId: Types.ObjectId;
  participantIds: Types.ObjectId[];
  name: string;
}

const dmSchema = new Schema({
  creatorId: { type: Types.ObjectId, ref: 'User', required: true },
  participantIds: { type: [Types.ObjectId], ref: 'User', required: true },
  name: { type: String, length: { min: 2, max: 32 }, trim: true },
  imageUrl: { type: String },
});

dmSchema.pre('save', function (next) {
  this.participantIds = [this.creatorId, ...this.participantIds];
  next();
});

const DM = mongoose.model<IDM>('DM', dmSchema, 'dms');

export default DM;