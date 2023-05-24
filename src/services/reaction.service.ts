import { Types } from 'mongoose';

import Reaction from '../models/Reaction.model';

const create = async (fields: {
  reactorId: Types.ObjectId | string,
  messageId: Types.ObjectId | string,
  emojiId?: Types.ObjectId | string,
  emoji?: string,
}) => {
  const reaction = new Reaction(fields);

  await reaction.save();

  return reaction;
};

const getOne = async (fields: {
  reactorId: Types.ObjectId | string,
  messageId: Types.ObjectId | string,
  emojiId?: Types.ObjectId | string,
  emoji?: string,
}) => {
 const reaction = await Reaction.findOne(fields);

 return reaction;
}

export default {
  create,
  getOne,
};