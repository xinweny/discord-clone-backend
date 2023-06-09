import { Schema, Types } from 'mongoose';

const channelSchema = new Schema({
  name: { type: String, required: true, length: { max: 32 } },
  category: { type: Types.ObjectId, refPath: 'categories' },
  type: { type: String, enum: ['text', 'voice'] },
});

export default channelSchema;