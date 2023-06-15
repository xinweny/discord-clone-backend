import { Types } from 'mongoose';

import cloudHelper from '../helpers/cloudHelper';
import formatDataUri from '../helpers/formatDataUri';

import Server from '../models/Server.model';

const create = async (
  serverId: Types.ObjectId | string,
  file: Express.Multer.File,
  fields: {
    creatorId: Types.ObjectId | string,
    name: string,
  }) => {
  const server = await Server.findById(serverId);

  if (!server) return null;

  const dataUri = formatDataUri(file.buffer, file.mimetype);

  const cloudRes = await cloudHelper.upload(dataUri, `emojis/${serverId.toString()}`);

  server.customEmojis.push({
    ...fields,
    url: cloudRes.secure_url,
  });

  const emoji = server.customEmojis.slice(-1)[0];

  await server.save();

  return emoji;
};

export default {
  create,
};