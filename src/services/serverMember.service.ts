import { Types } from 'mongoose';

import ServerMember from '../models/ServerMember.model';

const create = async (fields: {
  userId: Types.ObjectId | string,
  serverId: Types.ObjectId | string,
  username: string,
}) => {
  const member = new ServerMember(fields);

  await member.save();

  return member;
}

export default {
  create,
}