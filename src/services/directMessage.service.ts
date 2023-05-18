import { Types } from 'mongoose';

import keepKeys from '../helpers/keepKeys';

import DirectMessage from '../models/DirectMessage.model';

const create = async (fields: {
  creatorId: Types.ObjectId,
  participantIds: Types.ObjectId[] | string[],
  name?: string,
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

const exists = async (fields: {
  creatorId: Types.ObjectId,
  participantIds: Types.ObjectId[] | string[],
  name?: string,
}) => await DirectMessage.exists(fields);

const checkMembership = async (userId: string, roomId: string) => {
  const directMessage = await DirectMessage.findById(roomId);

  return directMessage?.participantIds.some((id) => id.toString() === userId);
}

export default {
  create,
  update,
  exists,
  checkMembership,
}