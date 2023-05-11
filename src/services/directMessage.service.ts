import { Types } from 'mongoose';

import keepKeys from '../helpers/keepKeys';

import DirectMessage from '../models/DirectMessage.model';

const create = async (
  creatorId: Types.ObjectId,
  participantIds: Types.ObjectId[] | string[]
) => {
  const directMessage = new DirectMessage({
    creatorId,
    participantIds,
  });

  await directMessage.save();

  return directMessage;
};

const update = async (
  id: string,
  updateFields: {
    participantIds: string[],
  }
) => {
  const updateQuery = keepKeys(updateFields, ['participantIds']);

  const updatedDirectMessage = await DirectMessage.findByIdAndUpdate(id, {
    $set: updateQuery,
  }, { new: true });

  return updatedDirectMessage;
};

export default {
  create,
  update,
}