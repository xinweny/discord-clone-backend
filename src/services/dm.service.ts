import { Types } from 'mongoose';

import keepKeys from '../helpers/keepKeys';
import CustomError from '../helpers/CustomError';

import cloudinaryService from './cloudinary.service';

import Message from '../models/Message.model';
import User from '../models/User.model';
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

  await Promise.all([
    dm.save(),
    User.updateMany({ _id: { $in: participantIds } }, {
      $push: { dmIds: dm._id },
    }),
  ]);

  return dm;
};

const update = async (
  dmId: Types.ObjectId | string,
  fields: { name: string },
  imgFile?: Express.Multer.File
) => {
  let image;

  const group = await DM.findOne({ _id: dmId, isGroup: true });

  if (!group) throw new CustomError(400, 'Cannot update non-group DM.');
  
  if (imgFile) {
    image = await cloudinaryService.upload(imgFile, `avatars/groups/${dmId}`, group?.imageUrl);
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

const remove = async (dmId: Types.ObjectId | string) => {
  const [dm, ] = await Promise.all([
    DM.findByIdAndDelete(dmId),
    Message.deleteMany({ roomId: dmId }),
  ]);

  return dm;
}

export default {
  getById,
  create,
  update,
  remove,
  checkMembership,
};