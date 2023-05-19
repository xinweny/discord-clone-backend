import { Types } from 'mongoose';

import Reaction from '../models/Reaction.model';

const create = async (fields: {
  reactorId: Types.ObjectId | string,
  messageId: Types.ObjectId | string,
  emoji: string,
}) => {
  const reaction = new Reaction(fields);

  reaction.save();
};

export default {
  create,
};