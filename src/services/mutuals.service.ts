import { Types } from 'mongoose';

import CustomError from '../helpers/CustomError';

import User from '../models/User.model';
import Server from '../models/Server.model';

const getFriends = async (userId1: Types.ObjectId | string, userId2: Types.ObjectId | string) => {
  const userIds = [userId1, userId2].map(id => new Types.ObjectId(id.toString()));

  const users = await User.find({ _id: { $in: userIds } }, 'relations');
  
  if (users.length < 2) throw new CustomError(400, 'User not found.');

  const friendIds = users.map(user =>
    user.relations
      .filter(relation => relation.status === 1)
      .map(relation => relation.userId.toString())
  );

  const mutualIds = [...new Set(friendIds[0].filter(id => friendIds[1].includes(id)))];

  const mutualFriends = await User.find({
    _id: { $in: mutualIds.map(id => new Types.ObjectId(id)) },
  }, 'displayName username avatarUrl');

  return mutualFriends;
};

const getServers = async (userId1: Types.ObjectId | string, userId2: Types.ObjectId | string) => {
  const userIds = [userId1, userId2].map(id => new Types.ObjectId(id.toString()));

  const users = await User.find({ _id: { $in: userIds } }, 'serverIds');
  
  if (users.length < 2) throw new CustomError(400, 'User not found.');

  const serverIds = users.map(user => user.serverIds.map(id => id.toString()));

  const mutualIds = [...new Set(serverIds[0].filter(id => serverIds[1].includes(id)))];

  const mutualServers = await Server.find({
    _id: { $in: mutualIds.map(id => new Types.ObjectId(id)) },
  }, 'name imageUrl');

  return mutualServers;
};

export default {
  getFriends,
  getServers,
};