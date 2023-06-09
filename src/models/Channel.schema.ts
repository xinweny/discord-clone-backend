import { Schema, Types } from 'mongoose';

export interface IPermissions {
  private: boolean;
  view: [Types.ObjectId];
  message: [Types.ObjectId];
}
export interface IChannel extends Types.Subdocument {
  name: string;
  categoryId?: Types.ObjectId;
  type: string;
  permissions: IPermissions;
}

const channelSchema = new Schema({
  name: { type: String, required: true, length: { max: 32 } },
  categoryId: { type: Types.ObjectId, refPath: 'categories' },
  type: { type: String, enum: ['text', 'voice'] },
  permissions: {
    type: {
      private: { type: Boolean, default: false },
      view: { type: [Types.ObjectId], refPath: 'Server.roles' },
      message: { type: [Types.ObjectId], refPath: 'Server.roles' },
    },
    default: {},
  }
});

export default channelSchema;