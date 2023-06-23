import { Types } from 'mongoose';

import keepKeys from '../helpers/keepKeys';

import cloudinaryService from './cloudinary.service';

import DM from '../models/DM.model';

const getById = async (dmId: Types.ObjectId | string) => {
  const dm = await DM.findById(dmId);

  return dm;
};

const create = async (participantIds: Types.ObjectId[] | string[]) => {
  const isGroup = participantIds.length > 2;

  const dm = new DM({
    ...(isGroup && { ownerId: participantIds[0] }),
    participantIds,
    isGroup,
  });

  await dm.save();

  return dm;
};

const addParticipants = async (
  id: string,
  userIds: string[],
) => {
  const dm = await DM.findByIdAndUpdate(id, {
    $push: { participantIds: { $in: userIds }},
  }, { new: true, runValidators: true });

  return dm;
};

const update = async (
  dmId: Types.ObjectId | string,
  fields: { name: string },
  imgFile?: Express.Multer.File
) => {
  let image;
  
  if (imgFile) {
    const dm = await DM.findById(dmId);

    image = await cloudinaryService.upload(imgFile, `avatars/groups/${dmId}`, dm?.imageUrl);
  }

  const query = keepKeys(fields, ['name']);

  const dm = await DM.findByIdAndUpdate(dmId, {
    $set: {
      ...query,
      ...(image && { imageUrl: image.secure_url }),
    },
  }, { new: true, runValidators: true });

  return dm;
};

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
  getById,
  create,
  addParticipants,
  update,
  checkMembership,
  removeParticipant,
}