import { Types } from 'mongoose';

import Server, { IServer } from '../models/Server.model';
import { IServerMember } from '../models/ServerMember.model';
import Message from '../models/Message.model';

const create = async (serverId: Types.ObjectId | string, fields: {
  name: string,
  category?: Types.ObjectId | string,
  type?: string,
  permissions?: {
    private: boolean,
    view: Types.ObjectId[] | string[],
    message: Types.ObjectId[] | string[],
  },
}) => {
  const server = await Server.findById(serverId);

  if (!server) return null;

  server.channels.push(fields);

  const channel = server.channels.slice(-1);

  await server.save();

  return channel;
};

const update = async (
  serverId: Types.ObjectId | string,
  channelId: Types.ObjectId | string,
  fields: {
    name?: string,
    category?: Types.ObjectId | string,
}) => {
  const server = await Server.findOneAndUpdate({
    _id: serverId,
    'channels._id': channelId,
  }, {
    $set: { 'channels.$': fields },
  }, { new: true });

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
  ]);

  return channel;
};

const checkPermissions = (channelId: string, server: IServer, member: IServerMember) => {
  const channel = server.channels.id(channelId);

  if (!channel) return false;

  if (!channel.permissions.private) return true;

  const messagePermission = channel.permissions.message;

  if (messagePermission.some(id => member.roles.map(i => i.toString()).includes(id.toString()))) return true; 
  
  return false;
};

export default {
  create,
  update,
  remove,
  checkPermissions,
}