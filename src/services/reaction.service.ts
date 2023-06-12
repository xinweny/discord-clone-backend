import { Types } from 'mongoose';

import Reaction from '../models/Reaction.model';

interface IFields {
  reactorId: Types.ObjectId | string;
  messageId: Types.ObjectId | string;
  emojiId?: Types.ObjectId | string;
  emoji?: string;
}

const getById = async (id: Types.ObjectId | string) => {
  return await Reaction.findById(id);
};

const getOne = async (fields: IFields) => {
 const reaction = await Reaction.findOne(fields);

 return reaction;
};

const getByUser = async (reactorId: string, messageIds?: string[]) => {
  const reactions = await Reaction.find({
    reactorId,
    ...(messageIds && { messageId: { $in: messageIds } }),
  });

  return reactions;
};

const getByMessage = async (messageIds: string) => {
  const reactions = await Reaction.find({ messageId: { $in: messageIds } });

  return reactions;
} 

const create = async (fields: IFields) => {
  const reaction = new Reaction(fields);

  await reaction.save();

  return reaction;
};

const remove = async (id: string) => {
  await Reaction.findByIdAndDelete(id);
};

export default {
  create,
  getOne,
  getById,
  getByUser,
  getByMessage,
  remove,
};