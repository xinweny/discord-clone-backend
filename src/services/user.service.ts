import User from '../models/User.model';

import keepKeys from '../helpers/keepKeys';

const getUser = async (queryObj: {
  _id?: string,
  email?: string,
  password?: string,
}, sensitive = false) => {
  const query = keepKeys(queryObj, ['_id', 'email', 'password']);

  let user;

  if (sensitive) {
    user = await User.findOne(query).select('+email +password');
  } else {
    user = await User.findOne(query);
  }

  return user;
};

const createUser = async (
  email: string,
  username: string,
  password: string,
) => {
  const user = new User({
    email,
    username,
    password,
  });

  await user.save();

  return user;
};

const updateUser = async (id: string, updateFields: {
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
  createUser,
  updateUser,
};