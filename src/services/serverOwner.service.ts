import { Types } from 'mongoose';

import Server from '../models/Server.model';

const update = async (serverId: Types.ObjectId | string, memberId: Types.ObjectId | string) => {
  const server = await Server.findByIdAndUpdate(serverId, {
    creatorId: memberId,
  }, { new: true });

  return server;
};

export default {
  update,
};