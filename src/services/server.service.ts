import { Types } from 'mongoose';

import Server from '../models/Server.model';

const create = async (fields: {
  creatorId: Types.ObjectId | string,
  name: string,
  private: boolean,
}) => {
  const server = new Server(fields);

  server.categories.push({
    $each: [{ name: 'Text Channels' }, { name: 'Voice Channels' }],
  });

  server.channels.push({
    $each: [
      { name: 'general', category: server.categories[0]._id, type: 'text' },
      { name: 'General', category: server.categories[1]._id, type: 'voice' },
    ],
  });

  await server.save();

  return server;
};

export default {
  create,
};