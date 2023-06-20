import { Schema, Types } from 'mongoose';

export interface IRelation extends Types.Subdocument {
  userId: Types.ObjectId;
  status: number;
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
    default: 0,
  },
}, { timestamps: { createdAt: true } });

export default relationSchema;