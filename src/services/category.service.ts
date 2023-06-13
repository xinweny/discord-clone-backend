import { Types } from 'mongoose';

import Server from '../models/Server.model';

const create = async (serverId: Types.ObjectId | string, name: string) => {
  const server = await Server.findById(serverId);

  if (!server) return null;

  server.categories.push({ name });

  const category = server.categories.slice(-1);

  return category;
};

const update = async (serverId: Types.ObjectId | string, categoryId: Types.ObjectId | string, name: string) => {
  const server = await Server.findOneAndUpdate({
    _id: serverId,
    'categories._id': categoryId,
  }, {
    $set: { 'categories.$': { name } },
  }, { new: true });

  const category = server?.channels.id(categoryId);

  return category;
};

const remove = async (serverId: Types.ObjectId | string, categoryId: Types.ObjectId | string) => {
  const server = await Server.findByIdAndUpdate(serverId, {
    $pull: { categories: { _id: categoryId } },
    $unset: { 'channels.$[c].categoryId': true }
  }, {
    arrayFilters: [
      { 'c.categoryId': categoryId },
    ],
  });

  const category = server?.categories.id(categoryId);

  return category;
};

export default {
  create,
  update,
  remove,
};