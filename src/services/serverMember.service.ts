import { Types } from 'mongoose';

import keepKeys from '../helpers/keepKeys';

import ServerMember from '../models/ServerMember.model';

const getById = async (userId: Types.ObjectId | string, serverId: Types.ObjectId | string) => {
  const member = await ServerMember.findOne({ userId, serverId });

  return member;
};

const getMany = async (fields: {
  userId?: Types.ObjectId | string,
  serverId?: Types.ObjectId | string,
}) => {
  const members = await ServerMember.find(fields);

  return members;
}

const create = async (fields: {
  userId: Types.ObjectId | string,
  serverId: Types.ObjectId | string,
  displayName: string,
}) => {
  const member = new ServerMember(fields);

  await member.save();

  return member;
};

const update = async (id: Types.ObjectId | string, fields: {
  displayName?: string,
  bio?: string,
  bannerColor?: string,
}) => {
  const updateQuery = keepKeys(fields, ['displayName', 'bio', 'bannerColor']);

  const member = await ServerMember.findByIdAndUpdate(id, {
    $set: updateQuery,
  }, { new: true });

  return member;
};

const remove = async (userId: Types.ObjectId | string, serverId: Types.ObjectId | string) => {
  const deletedMember = await ServerMember.findOneAndDelete({ userId, serverId });

  return deletedMember;
};

export default {
  getById,
  getMany,
  create,
  update,
  remove,
}