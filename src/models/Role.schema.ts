import { Schema, Types } from 'mongoose';

export interface IRole extends Types.Subdocument {
  name: string,
  color: string,
  permissions: {
    [key: string]: boolean,
  },
}

const roleSchema = new Schema({
  name: { type: String },
  color: { type: String, required: true },
  permissions: {
    administrator: { type: Boolean, default: false },
    viewChannels: { type: Boolean, default: true },
    manageChannels: { type: Boolean, default: false },
    manageRoles: { type: Boolean, default: false },
    manageExpressions: { type: Boolean, default: false },
    kickMembers: { type: Boolean, default: false },
    manageServer: { type: Boolean, default: false },
    createInvite: { type: Boolean, default: true },
    sendMessages: { type: Boolean, default: true },
    manageMessages: { type: Boolean, default: false },
    addReactions: { type: Boolean, default: true },
    joinCall: { type: Boolean, default: true },
    speak: { type: Boolean, default: true },
    video: { type: Boolean, default: true },
  },
});

export default roleSchema;