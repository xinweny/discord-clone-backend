import mongoose, { Schema, Types, Document } from 'mongoose';

import CustomError from '../helpers/CustomError';

import roleSchema, { IRole } from './Role.schema';
import categorySchema, { ICategory } from './Category.schema';
import customEmojiSchema, { ICustomEmoji } from './CustomEmoji.schema';
import channelSchema, { IChannel } from './Channel.schema';
import { IServerMember } from './ServerMember.model';

export interface IServer extends Document {
  ownerId: Types.ObjectId;
  name: string;
  roles: Types.DocumentArray<IRole>;
  categories: Types.DocumentArray<ICategory>;
  channels: Types.DocumentArray<IChannel>;
  customEmojis: Types.DocumentArray<ICustomEmoji>;
  memberCount: number;
  imageUrl?: string;
  private: boolean;
  checkPermissions(member: IServerMember, permissionKeys: string[]): boolean;
}

const serverSchema = new Schema({
  ownerId: { type: Types.ObjectId, ref: 'ServerMember', required: true },
  name: { type: String, required: true, unique: true },
  roles: { type: [roleSchema], default: () => ([]) },
  categories: { type: [categorySchema], default: () => ([]) },
  channels: { type: [channelSchema], default: () => ([]) },
  customEmojis: { type: [customEmojiSchema], default: () => ([]) },
  imageUrl: { type: String },
  memberCount: { type: Number, required: true, default: 1 },
  private: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

serverSchema.pre('save', function (next) {
  for (const subdocs of [this.roles, this.categories, this.channels, this.customEmojis]) {
    const names = subdocs.map(subdoc => subdoc.name);
    if ((new Set(names)).size !== names.length) throw new CustomError(400, 'Duplicate values not allowed.');
  }

  if (this.customEmojis.length > 100) throw new CustomError(400, 'Custom emoji limit (100) exceeded.');

  next();
});

serverSchema.method(
  'checkPermissions',
  function (member: IServerMember, permissionKeys: string[] = []) {
    if (this.ownerId.equals(member._id)) return true;

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