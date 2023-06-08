import { Types } from 'mongoose';

import Server from '../models/Server.model';

const create = async (serverId: Types.ObjectId | string, fields: {
  name: string,
  category?: Types.ObjectId | string,
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

  await server.save();

  return channel;
}

export default {
  create,
  update,
  remove,
}