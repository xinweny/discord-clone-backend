import { Types } from 'mongoose';

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

export default {
  create,
}