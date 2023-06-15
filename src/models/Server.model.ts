import mongoose, { Schema, Types, Document } from 'mongoose';

import CustomError from '../helpers/CustomError';

import roleSchema, { IRole } from './Role.schema';
import categorySchema, { ICategory } from './Category.schema';
import customEmojiSchema, { ICustomEmoji } from './CustomEmoji.schema';
import channelSchema, { IChannel } from './Channel.schema';
import { IServerMember } from './ServerMember.model';

interface IServer extends Document {
  creatorId: Types.ObjectId;
  name: string;
  roles: Types.DocumentArray<IRole>;
  categories: Types.DocumentArray<ICategory>;
  channels: Types.DocumentArray<IChannel>;
  customEmojis: Types.DocumentArray<ICustomEmoji>;
  imageUrl?: string;
  private: boolean;
  checkPermissions(member: IServerMember, permissionKeys: string[]): boolean;
}

export { IServer };

const serverSchema = new Schema({
  creatorId: { type: Types.ObjectId, ref: 'ServerMember', required: true },
  name: { type: String, required: true, unique: true },
  roles: { type: [roleSchema], default: () => ([]) },
  categories: { type: [categorySchema], default: () => ([]) },
  channels: { type: [channelSchema], default: () => ([]) },
  customEmojis: { type: [customEmojiSchema], default: () => ([]) },
  imageUrl: { type: String },
  private: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

serverSchema.pre('save', function (next) {
  for (const subdocs of [this.roles, this.categories, this.channels, this.customEmojis]) {
    const names = subdocs.map(subdoc => subdoc.name);
    if ((new Set(names)).size !== names.length) throw new CustomError(400, 'Duplicate values not allowed.');
  }

  next();
});

serverSchema.method(
  'checkPermissions',
  function (member: IServerMember, permissionKeys: string[] = []) {
    if (this.creatorId.equals(member._id)) return true;

    const roles = this.roles;

    if (member.roleIds.some(id => {
      const role = roles.id(id);

      if (!role) return false;
      if (role.permissions.administrator) return true;

      if (permissionKeys.some(key => role.permissions[key])) return true;

      return false;
    })) return true;

    return false;
  }
);

const Server = mongoose.model<IServer>('Server', serverSchema);

export default Server;