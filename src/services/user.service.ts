import User from '../models/User.model';

import keepKeys from '../helpers/keepKeys';

const getUser = async (queryObj: {
  _id?: string,
  email?: string,
  password?: string,
}, sensitive = false) => {
  const query = keepKeys(queryObj, ['_id', 'email', 'password']);

  const user = sensitive
    ? await User.findOne(query).select('+email +password')
    : await User.findOne(query);

  return user;
};

const create = async (fields: {
  email: string,
  username: string,
  password: string,
}) => {
  const user = new User(fields);

  await user.save();

  return user;
};

const update = async (id: string, updateFields: {
  email?: string,
  password?: string,
  username?: string,
  avatarUrl?: string,
  verified?: boolean,
}) => {
  const updateQuery = keepKeys(updateFields, ['password', 'username', 'email', 'avatarUrl', 'verified']);

  const updatedUser = await User.findByIdAndUpdate(id, {
    $set: updateQuery,
  }, { new: true });

  return updatedUser;
}

export default {
  getUser,
  create,
  update,
};