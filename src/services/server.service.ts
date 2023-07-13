import { Types } from 'mongoose';
import type { UploadApiResponse } from 'cloudinary';

import CustomError from '../helpers/CustomError';
import keepKeys from '../helpers/keepKeys';

import User from '../models/User.model';
import Message from '../models/Message.model';
import ServerMember from '../models/ServerMember.model';
import Server from '../models/Server.model';

import serverInviteService from './serverInvite.service';
import cloudinaryService from './cloudinary.service';

const getPublic = async (
  query?: string,
  pagination?: { page: number, limit: number },
) => {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10; 

  const queryObj = {
    private: false,
    ...(query && { $text: { $search: query } }),
  };

  const [servers, count] = await Promise.all([
    Server
      .find(
        queryObj,
        query ? { score: { $meta: 'textScore' } } : undefined
      )
      .select('name createdAt memberCount description imageUrl')
      .sort(query ? { score: { $meta: 'textScore' } } : { memberCount: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Server.countDocuments(queryObj)
  ]);

  return { servers, count };
}

const getById = async (id: Types.ObjectId | string) => {
  const server = await Server.findById(id);

  return server;
};

const create = async (
  fields: {
    name: string,
    private: boolean,
  },
  userId: Types.ObjectId | string,
  imgFile?: Express.Multer.File
) => {
  const user = await User.findById(userId);

  if (!user) return null;

  const serverId = new Types.ObjectId();

  const creator = new ServerMember({
    userId,
    serverId,
    displayName: user.username,
  });

  const query = keepKeys(fields, ['name', 'private']);
  
  const server = new Server({
    _id: serverId,
    ownerId: creator._id,
    ...query,
  });

  if (imgFile) {
    const image = await cloudinaryService.upload(imgFile, `avatars/servers/${serverId}`);

    server.avatarUrl = image.secure_url;
  }

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
  await Promise.all([
    creator.save(),
    serverInviteService.create(serverId),
    User.findByIdAndUpdate(userId, { $push: { serverIds: serverId } }),
  ]);

  return { server, creator };
};

const update = async (id: Types.ObjectId | string, fields: {
  name?: string,
  private?: boolean,
  type?: 'text' | 'voice',
  description?: string,
}, imgFiles: { avatar?: Express.Multer.File, banner?: Express.Multer.File }) => {
  const { avatar, banner } = imgFiles;

  const uploadRes: {
    avatar: UploadApiResponse | null,
    banner: UploadApiResponse | null,
  } = { avatar: null, banner: null };
  
  if (avatar || banner) {
    const server = await Server.findById(id, 'avatarUrl bannerUrl');

    if (avatar) uploadRes.avatar = await cloudinaryService.upload(avatar, `avatars/servers/${id}`, server?.avatarUrl);
    if (banner) uploadRes.banner = await cloudinaryService.upload(banner, `banners/servers/${id}`, server?.bannerUrl);
  }

  const query = keepKeys(fields, ['name', 'private', 'description']);
  const avatarRes = uploadRes.avatar;
  const bannerRes = uploadRes.banner;

  const server = await Server.findByIdAndUpdate(id, {
    $set: {
      ...query,
      ...(avatarRes && { avatarUrl: avatarRes.secure_url }),
      ...(bannerRes && { bannerUrl: bannerRes.secure_url }),
    },
  }, { new: true, runValidators: true });

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
  const [server, members] = await Promise.all([
    Server.findById(id),
    ServerMember.find({ serverId: id }, 'userId -_id')
  ]);

  if (!server) throw new CustomError(400, 'Server not found.');

  const channelIds = server?.channels.map(channel => channel._id);

  await Promise.all([
    Server.findByIdAndDelete(id),
    ServerMember.deleteMany({ serverId: id }),
    User.updateMany(
      { _id: { $in: members.map(member => member.userId) } },
      { $pull: { serverIds: id } }
    ),
    Message.deleteMany({ roomId: { $in: channelIds } }),
    cloudinaryService.deleteByFolder(`attachments/${id.toString()}`),
    (server.avatarUrl) ? cloudinaryService.deleteByUrl(server.avatarUrl) : Promise.resolve(),
    serverInviteService.remove(server._id),
  ]);
}

export default {
  getPublic,
  getById,
  create,
  update,
  remove,
  checkPermissions,
};