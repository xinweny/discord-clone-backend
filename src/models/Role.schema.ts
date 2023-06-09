import { Schema, Types } from 'mongoose';

const roleSchema = new Schema({
  name: { type: String, unique: true },
  color: { type: String },
  permissions: {
    read: [{ type: Types.ObjectId, refPath: 'channels' }],
    write: [{ type: Types.ObjectId, refPath: 'channels' }],
    admin: { type: Boolean, default: false },
  },
});

export default roleSchema;