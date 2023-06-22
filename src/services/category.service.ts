import { Types } from 'mongoose';

import CustomError from '../helpers/CustomError';
import formatSetQuery from '../helpers/formatSetQuery';

import Server from '../models/Server.model';

const get = async (serverId: Types.ObjectId | string, categoryId?: Types.ObjectId | string) => {
  const server = await Server.findById(
    serverId,
    categoryId ? { roles: { $elemMatch: { _id: categoryId } } } : 'categories'
  );

  if (!server) throw new CustomError(400, 'Server not found.');

  return (categoryId) ? server.categories[0] : server.categories;
};

const create = async (serverId: Types.ObjectId | string, name: string) => {
  const server = await Server.findById(serverId);

  if (!server) return null;

  server.categories.push({ name });

  await server.save();

  const category = server.categories.slice(-1)[0];

  return category;
};

const update = async (serverId: Types.ObjectId | string, categoryId: Types.ObjectId | string, name: string) => {
  const server = await Server.findOneAndUpdate({
    _id: serverId,
    'categories._id': categoryId,
  }, {
    $set: formatSetQuery({ name }, 'categories'),
  }, { new: true });

  const category = server?.categories.id(categoryId);

  return category;
};

const remove = async (serverId: Types.ObjectId | string, categoryId: Types.ObjectId | string) => {
  const server = await Server.findByIdAndUpdate(serverId, {
    $pull: { categories: { _id: categoryId } },
    $unset: { 'channels.$[c].categoryId': true },
  }, {
    arrayFilters: [
      { 'c.categoryId': categoryId },
    ],
  });

  const category = server?.categories.id(categoryId);

  return category;
};

export default {
  get,
  create,
  update,
  remove,
};