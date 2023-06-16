import { Types } from 'mongoose';

import Server from '../models/Server.model';
import ServerMember from '../models/ServerMember.model';

const update = async (serverId: Types.ObjectId | string, memberId: Types.ObjectId | string) => {
  const [server, member] = await Promise.all([
    Server.findByIdAndUpdate(serverId, {
      creatorId: memberId,
    }, { new: true }),
    ServerMember.findById(memberId),
  ])

  return { server, member };
};

export default {
  update,
};