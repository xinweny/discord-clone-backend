import { Schema, Types } from 'mongoose';

interface ICustomEmoji extends Types.Subdocument {
  creatorId: Types.ObjectId;
  name: string;
  url: string;
}

export { ICustomEmoji };

const customEmojiSchema = new Schema({
  creatorId: { type: Types.ObjectId, ref: 'ServerMember', required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
});

export default customEmojiSchema;