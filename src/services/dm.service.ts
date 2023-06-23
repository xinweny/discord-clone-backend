import { Types } from 'mongoose';

import DM from '../models/DM.model';

const create = async (fields: {
  ownerId: Types.ObjectId,
  participantIds: Types.ObjectId[] | string[],
  name?: string,
}) => {
  const dm = new DM(fields);

  await dm.save();

  return dm;
};

const addParticipants = async (
  id: string,
  userIds: string[],
) => {
  const dm = await DM.findByIdAndUpdate(id, {
    $push: { participantIds: { $in: userIds }},
  }, { new: true });

  return dm;
};

const exists = async (fields: {
  ownerId: Types.ObjectId,
  participantIds: Types.ObjectId[] | string[],
  name?: string,
}) => await DM.exists(fields);

const checkMembership = async (userId: string, roomId: string) => {
  const dm = await DM.findById(roomId);

  if (!dm) return false;

  if (dm.participantIds.some((id) => id.toString() === userId)) return dm;

  return false;
};

const removeParticipant = async (dmId: Types.ObjectId | string, participantId: Types.ObjectId | string) => {
  const dm = await DM.findByIdAndUpdate(dmId, {
    $pull: { participantIds: participantId },
  }, { new: true });

  return dm;
};

export default {
  create,
  addParticipants,
  update,
  exists,
  checkMembership,
  removeParticipant,
}