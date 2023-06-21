import { Schema, Types } from 'mongoose';

export interface IRelation extends Types.Subdocument {
  userId: Types.ObjectId;
  status: 0 | 1 | 2;
}

const relationSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  status: {
    type: Number,
    enum: [
      0, // pending
      1, // friends
      2, // blocked
    ],
    required: true,
  },
}, { timestamps: { createdAt: false, updatedAt: true } });

export default relationSchema;