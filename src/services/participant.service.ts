import { Types } from 'mongoose';

import DM from '../models/DM.model';

const add = async (
  dmId: string,
  userIds: string[],
) => {
  const dm = await DM
    .findByIdAndUpdate(
      dmId,
      {
        $push: { participantIds: { $in: userIds }},
        $set: { isGroup: true },
      },
      { new: true, runValidators: true }
    )
    .select('participantIds -_id');

  return dm;
};

const remove = async (dmId: Types.ObjectId | string, participantId: Types.ObjectId | string) => {
  const dm = await DM
    .findByIdAndUpdate(
      dmId,
      { $pull: { participantIds: participantId } },
      { new: true }
    )
    .select('participantIds -_id');

  return dm;
};

export default {
  add,
  remove,
};