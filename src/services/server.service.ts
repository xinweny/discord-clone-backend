import { Types } from 'mongoose';

import User from '../models/User.model';
import Message from '../models/Message.model';
import ServerMember from '../models/ServerMember.model';
import Server from '../models/Server.model';

import cloudinaryService from './cloudinary.service';

const getById = async (id: Types.ObjectId | string) => {
  const server = await Server.findById(id);

  return server;
};

const create = async (
  fields: {
    name: string,
    private: boolean,
  },
  userId: Types.ObjectId | string
) => {
  const user = await User.findById(userId);

  if (!user) return null;

  const serverId = new Types.ObjectId();

  const creator = new ServerMember({
    userId,
    serverId,
    displayName: user.username,
  });
  const server = new Server({
    _id: serverId,
    ownerId: creator._id,
    ...fields,
  });

  // Default channels
  server.categories.push({
    $each: [{ name: 'Text Channels' }, { name: 'Voice Channels' }],
  });

  server.channels.push({
    $each: [
      { name: 'general', category: server.categories[0]._id, type: 'text' },
      { name: 'General', category: server.categories[1]._id, type: 'voice' },
    ],
  });

  // Default roles
  server.roles.push({ name: '@everyone', color: '#99AAB5' });
  creator.roleIds.push(server.roles[0]._id);

  await server.save();
  await creator.save();

  return { server, creator };
};

const update = async (id: Types.ObjectId | string, fields: {
  name?: string,
  private?: boolean,
  type?: 'text' | 'voice',
}) => {
  const server = await Server.findByIdAndUpdate(id, {
    $set: fields,
  }, { new: true });

  return server;
};

const checkPermissions = async (
  serverId: Types.ObjectId | string,
  userId: Types.ObjectId | string,
  permissionKeys: string | string[] = [],
  memberId?: Types.ObjectId | string,
) => {
  const [server, member] = await Promise.all([
    Server.findById(serverId),
    ServerMember.findOne({ serverId, userId }),
  ]);

  if (!server || !member) return false;

  if (memberId && member._id.equals(memberId)) return { server, member };

  const permissions = (typeof permissionKeys === 'string') ? [permissionKeys] : permissionKeys;

  if (server.checkPermissions(member, permissions)) return { server, member };

  return false;
};

const remove = async (id: Types.ObjectId | string) => {
  const server = await Server.findById(id);
  const channelIds = server?.channels.map(channel => channel._id);

  await Promise.all([
    Server.findByIdAndDelete(id),
    ServerMember.deleteMany({ serverId: id }),
    Message.deleteMany({ roomId: { $in: channelIds } }),
    cloudinaryService.deleteFolder(`attachments/${id.toString()}`),
  ]);
}

export default {
  getById,
  create,
  update,
  remove,
  checkPermissions,
};