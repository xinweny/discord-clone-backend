import User from '../models/User.model';

const findOneUser = async (queryObj: {
  _id?: string,
  email?: string,
  password?: string,
}) => {
  const user = await User.findOne(queryObj);

  return user;
}

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
}

export default {
  findOneUser,
  createUser,
};