import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import validateFields from '../middleware/validateFields';
import tryCatch from '../middleware/tryCatch';

import CustomError from '../helpers/CustomError';
import renameObjectKey from '../helpers/renameObjectKey';

import serverService from '../services/server.service';
import channelService from '../services/channel.service';

const createChannel: RequestHandler[] = [
  authenticate,
  ...validateFields(['channelName']),
  tryCatch(
    async (req, res, next) => {
      const { serverId } = req.params;
      const userId = req.user!._id;

      const authorized = await serverService.checkPermissions(serverId, userId, ['manageChannels']);

      if (!authorized) throw new CustomError(401, 'Unauthorized');

      const fields = { ...req.body };
      renameObjectKey(fields, 'name', 'channelName');
      
      const channel = await channelService.create(serverId, { ...fields });

      res.json({
        data: channel,
        message: 'Channel created successfully.',
      });
    }
  )
];

export default {
  createChannel,
};