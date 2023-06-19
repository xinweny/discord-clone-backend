import { Schema, Types } from 'mongoose';

export interface ICategory extends Types.Subdocument {
  name: string;
}

const categorySchema = new Schema({
  name: { type: String, required: true },
});

export default categorySchema;