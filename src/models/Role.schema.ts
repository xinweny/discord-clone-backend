import { Schema, Types } from 'mongoose';

interface IRole extends Types.Subdocument {
  name: string,
  color: string,
  permissions?: { [key: string]: boolean },
}

const roleSchema = new Schema({
  name: { type: String },
  color: { type: String, required: true },
  permissions: {
    administrator: { type: Boolean, default: false },
    manageChannels: { type: Boolean, default: false },
    manageExpressions: { type: Boolean, default: false },
    manageServer: { type: Boolean, default: false },
    createInvite: { type: Boolean, default: true },
    sendMessages: { type: Boolean, default: true },
    joinCall: { type: Boolean, default: true },
    speak: { type: Boolean, default: true },
    video: { type: Boolean, default: true },
  },
});

export { IRole };
export default roleSchema;