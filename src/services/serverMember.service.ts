import { Types } from 'mongoose';

import CustomError from '../helpers/CustomError';
import keepKeys from '../helpers/keepKeys';

import User from '../models/User.model';
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

  const { userId, serverId } = fields;

  await Promise.all([
    member.save(),
    Server.findByIdAndUpdate(fields.serverId, {
      $inc: { memberCount: 1 },
    }),
    User.findByIdAndUpdate(userId, { $push: { serverIds: serverId } }),
  ]);

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
  const serverMember = await ServerMember.findById(id);

  if (!serverMember) throw new CustomError(400, 'Server member not found.');

  await Promise.all([
    ServerMember.findByIdAndDelete(id),
    User.findByIdAndUpdate(serverMember.userId, { $pull: { serverIds: serverMember.serverId } }),
  ]);

  return serverMember;
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