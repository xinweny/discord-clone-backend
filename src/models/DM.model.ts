import mongoose, { Schema, Types } from 'mongoose';

import CustomError from '../helpers/CustomError';

export interface IDM extends Document {
  ownerId?: Types.ObjectId;
  participantIds: Types.ObjectId[];
  name?: string;
  imageUrl?: string;
  isGroup: boolean;
}

const dmSchema = new Schema({
  ownerId: { type: Types.ObjectId, ref: 'User' },
  participantIds: { type: [Types.ObjectId], ref: 'User', required: true },
  name: { type: String, length: { min: 2, max: 32 }, trim: true },
  imageUrl: { type: String },
  isGroup: { type: Boolean, required: true },
});

dmSchema.pre('save', function (next) {
  if (this.participantIds.length > 10) throw new CustomError(400, 'Number of group members cannot exceed 10.');
  if (this.isGroup )

  next();
});

const DM = mongoose.model<IDM>('DM', dmSchema, 'dms');

export default DM;