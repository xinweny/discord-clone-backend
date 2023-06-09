import { Types } from 'mongoose';

import User from '../models/User.model';
import ServerMember from '../models/ServerMember.model';
import Server from '../models/Server.model';

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
    creatorId: creator._id,
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
  creator.roles.push(server.roles[0]._id);

  await Promise.all([server.save(), creator.save()]);

  return { server, creator };
};

export default {
  getById,
  create,
};