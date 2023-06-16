import { Schema, Types } from 'mongoose';

interface IAttachment extends Types.Subdocument {
  url: string;
  mimetype: string;
  filename: string;
}

export { IAttachment };

const attachmentSchema = new Schema({
  url: { type: String, required: true },
  mimetype: { type: String, required: true },
  filename: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export default attachmentSchema;