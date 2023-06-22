import { Types } from 'mongoose';
import { nanoid } from 'nanoid';

import env from '../config/env.config';

import keepKeys from '../helpers/keepKeys';
import CustomError from '../helpers/CustomError';

import ServerInvite from '../models/ServerInvite.model';

const getOne = async (fields: {
  inviteId?: string,
  url?: string,
  serverId?: string,
}) => {
  const query = keepKeys(fields, ['inviteId', 'url', 'serverId']);

  if (Object.keys(query).length === 0) throw new CustomError(400, 'Invalid query.');

  const invite = await ServerInvite.findOne(query);

  return invite;
}

const create = async (serverId: Types.ObjectId | string) => {
  const urlId = nanoid(8);

  const invite = new ServerInvite({
    serverId,
    url: `${env.BASE_SHORT_URL}/${urlId}`,
  });

  await invite.save();

  return invite;
};

const updateUrlId = async (serverId: Types.ObjectId | string) => {
  const urlId = nanoid(8);

  const invite = await ServerInvite.findOneAndUpdate(
    { serverId },
    { url: `${env.BASE_SHORT_URL}/${urlId}` },
    { new: true }
  );

  return invite;
};

const remove = async (serverId: Types.ObjectId | string) => {
  const invite = await ServerInvite.findOneAndDelete({ serverId });

  return invite;
};

export default {
  getOne,
  create,
  updateUrlId,
  remove,
}