import { Types } from 'mongoose';

import keepKeys from '../helpers/keepKeys';

import Server from '../models/Server.model';
import ServerMember from '../models/ServerMember.model';

const getById = async (id: Types.ObjectId | string) => {
  const member = await ServerMember.findById(id);

  return member;
};

const getOne = async (userId: Types.ObjectId | string, serverId: Types.ObjectId | string) => {
  const member = await ServerMember.findOne({ userId, serverId });

  return member;
};

const getMany = async (fields: {
  userId?: Types.ObjectId | string,
  serverId?: Types.ObjectId | string,
}) => {
  const members = await ServerMember.find(fields);

  return members;
};

const create = async (fields: {
  userId: Types.ObjectId | string,
  serverId: Types.ObjectId | string,
  displayName: string,
}) => {
  const server = await Server.findById(fields.serverId);
  
  if (!server) return null;

  const member = new ServerMember(fields);
  member.roleIds.push(server.roles[0]._id);

  await member.save();

  return member;
};

const update = async (id: Types.ObjectId | string, fields: {
  displayName?: string,
  bio?: string,
  bannerColor?: string,
  roleIds?: Types.ObjectId[] | string[],
}) => {
  const updateQuery = keepKeys(fields, ['displayName', 'bio', 'bannerColor', 'roleIds']);

  const member = await ServerMember.findByIdAndUpdate(id, {
    $set: updateQuery,
  }, { new: true });

  return member;
};

const remove = async (id: Types.ObjectId | string) => {
  const deletedMember = await ServerMember.findByIdAndDelete(id);

  return deletedMember;
};

const checkMembership = async (userId: Types.ObjectId | string, memberId: Types.ObjectId | string) => {
  const member = await ServerMember.findById(memberId);

  if (member && member.userId.equals(userId)) return member;

  return null;
}

export default {
  getById,
  getOne,
  getMany,
  create,
  update,
  remove,
  checkMembership,
}