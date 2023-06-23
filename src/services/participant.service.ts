import { Types } from 'mongoose';

import CustomError from '../helpers/CustomError';

import DM from '../models/DM.model';

const add = async (
  dmId: string,
  userIds: string[],
) => {
  const dm = await DM.findById(dmId, 'participantIds');

  if (dm && dm.participantIds.length === 10) throw new CustomError(400, 'Number of group members cannot exceed 10.');

  const updatedDm = await DM
    .findByIdAndUpdate(
      dmId,
      {
        $push: { participantIds: { $in: userIds }},
        $set: { isGroup: true },
      },
      { new: true }
    )
    .select('participantIds -_id');

  return updatedDm;
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