import { Types } from 'mongoose';

import keepKeys from '../helpers/keepKeys';

import DirectMessage from '../models/DirectMessage.model';

const create = async (fields: {
  creatorId: Types.ObjectId,
  participantIds: Types.ObjectId[] | string[],
}) => {
  const directMessage = new DirectMessage(fields);

  await directMessage.save();

  return directMessage;
};

const update = async (
  id: string,
  fields: {
    participantIds: string[],
  }
) => {
  const updateQuery = keepKeys(fields, ['participantIds']);

  const updatedDirectMessage = await DirectMessage.findByIdAndUpdate(id, {
    $set: updateQuery,
  }, { new: true });

  return updatedDirectMessage;
};

export default {
  create,
  update,
}