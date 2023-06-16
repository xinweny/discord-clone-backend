import { Schema, Types } from 'mongoose';

interface ICategory extends Types.Subdocument {
  name: string;
}

export { ICategory };

const categorySchema = new Schema({
  name: { type: String, required: true },
});

export default categorySchema;