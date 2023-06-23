import { Types } from 'mongoose';

import formatSetQuery from '../helpers/formatSetQuery';
import CustomError from '../helpers/CustomError';

import Server, { IServer } from '../models/Server.model';
import { IServerMember } from '../models/ServerMember.model';
import Message from '../models/Message.model';
import { IPermissions } from '../models/Channel.schema';

import cloudinaryService from './cloudinary.service';

const get = async (serverId: Types.ObjectId | string, channelId?: Types.ObjectId | string) => {
  const server = await Server.findById(
    serverId,
    channelId ? { roles: { $elemMatch: { _id: channelId } } } : 'channels'
  );

  if (!server) throw new CustomError(400, 'Server not found.');

  return (channelId) ? server.channels[0] : server.channels;
};

const create = async (serverId: Types.ObjectId | string, fields: {
  name: string,
  categoryId?: Types.ObjectId | string,
  type?: string,
  permissions?: {
    private: boolean,
    view: Types.ObjectId[] | string[],
    message: Types.ObjectId[] | string[],
  },
}) => {
  const server = await Server.findById(serverId);

  if (!server) throw new CustomError(400, 'Server not found.');

  const { categoryId } = fields;

  if (categoryId && !server.categories.id(categoryId)) throw new CustomError(400, 'Category does not exist.');

  server.channels.push(fields);

  const channel = server.channels.slice(-1)[0];

  await server.save();

  return channel;
};

const update = async (
  serverId: Types.ObjectId | string,
  channelId: Types.ObjectId | string,
  fields: {
    name?: string,
    categoryId?: Types.ObjectId | string,
}) => {
  const server = await Server.findOneAndUpdate({
    _id: serverId,
    'channels._id': channelId,
  }, {
    $set: formatSetQuery(fields, 'channels'),
  }, { new: true, runValidators: true });

  const channel = server?.channels.id(channelId);

  return channel;
};

const remove = async (serverId: Types.ObjectId | string, channelId: Types.ObjectId | string) => {
  const server = await Server.findById(serverId);

  if (!server) return null;

  const channel = server.channels.id(channelId);

  server.channels.pull(channelId);

  await Promise.all([
    server.save(),
    Message.deleteMany({ roomId: channelId }),
    cloudinaryService.deleteByFolder(`attachments/${serverId}/${channel?._id.toString()}`)
  ]);

  return channel;
};

const checkPermissions = (channelId: string, server: IServer, member: IServerMember, permissionKey: keyof IPermissions) => {
  const channel = server.channels.id(channelId);

  if (!channel) return false;

  if (permissionKey === 'message' && channel.type === 'voice') throw new CustomError(400, 'Cannot message in voice channels.');

  if (!channel.permissions.private) return true;

  if (permissionKey !== 'private') {
    const messagePermission = channel.permissions[permissionKey];

    if (messagePermission.some(id => member.roleIds.map(i => i.toString()).includes(id.toString()))) return true; 
  }
  
  return false;
};

export default {
  get,
  create,
  update,
  remove,
  checkPermissions,
}