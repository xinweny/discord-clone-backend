import { Schema, Types } from 'mongoose';

interface ICustomEmoji extends Types.Subdocument {
  name: string;
  url: string;
}

export { ICustomEmoji };

const customEmojiSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

export default customEmojiSchema;