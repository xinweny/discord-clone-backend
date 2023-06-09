import { Schema } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, unique: true },
});

export default categorySchema;