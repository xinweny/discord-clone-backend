import { Types } from 'mongoose';

import keepKeys from '../helpers/keepKeys';
import CustomError from '../helpers/CustomError';

import cloudinaryService from './cloudinary.service';

import User from '../models/User.model';

const getOne = async (queryObj: {
  _id?: Types.ObjectId | string,
  email?: string,
  password?: string,
}, sensitive = false) => {
  const query = keepKeys(queryObj, ['_id', 'email', 'password']);

  const user = sensitive
    ? await User.findOne(query).select('+email +password')
    : await User.findOne(query);

  return user;
};

const getById = async (id: Types.ObjectId | string) => {
  const user = await User.findById(id);

  if (!user) throw new CustomError(400, 'User not found.');

  return user;
}

const create = async (fields: {
  email: string,
  username: string,
  password: string,
}) => {
  const user = new User({
    ...fields,
    displayName: fields.username,
  });

  await user.save();

  return user;
};

const updateSensitive = async (id: Types.ObjectId | string, fields: {
  verified?: true,
  password?: string,
}) => {
  const user = await User.findByIdAndUpdate(id, fields, { new: true });

  return user;
};

const update = async (id: Types.ObjectId | string, fields: {
  username?: string,
  displayName?: string,
  bannerColor?: string,
  bio?: string,
}, avatarFile?: Express.Multer.File) => {
  const updateQuery = keepKeys(fields, ['username', 'displayName', 'bannerColor', 'bio']);

  let avatar;

  if (avatarFile) {
    const user = await User.findById(id);

    avatar = await cloudinaryService.upload(avatarFile, `avatars/${id}`, user?.avatarUrl);
  }

  const user = await User.findByIdAndUpdate(id, {
    $set: {
      ...updateQuery,
      ...(avatar && { avatarUrl: avatar.secure_url }),
    },
  }, { new: true });

  return user;
};

const remove = async (id: Types.ObjectId | string) => {
  const user = await User.findById(id);

  if (!user) throw new CustomError(400, 'User not found.');

  if (user.avatarUrl) await cloudinaryService.deleteByUrl(user.avatarUrl);

  await user.deleteOne();

  return user;
};

export default {
  getOne,
  getById,
  create,
  update,
  updateSensitive,
  remove,
};