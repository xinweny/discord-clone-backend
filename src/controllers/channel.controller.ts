import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import validateFields from '../middleware/validateFields';
import tryCatch from '../middleware/tryCatch';

import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';
import channelService from '../services/channel.service';

const createChannel: RequestHandler[] = [
  authenticate,
  ...validateFields(['channelName']),
  tryCatch(
    async (req, res) => {
      const { serverId } = req.params;

      const authorized = await serverService.checkPermissions(serverId, req.user!._id, ['manageChannels']);

      if (!authorized) throw new CustomError(401, 'Unauthorized');
      
      const channel = await channelService.create(serverId, { ...req.body });

      res.json({
        data: channel,
        message: 'Channel created successfully.',
      });
    }
  )
];

const updateChannel: RequestHandler[] = [
  authenticate,
  ...validateFields(['channelName']),
  tryCatch(
    async (req, res) => {
      const { serverId, channelId } = req.params;

      const authorized = await serverService.checkPermissions(serverId, req.user!._id, ['manageChannels']);

      if (!authorized) throw new CustomError(401, 'Unauthorized');
      
      const channel = await channelService.update(serverId, channelId, { ...req.body });

      res.json({
        data: channel,
        message: 'Channel successfully updated',
      });
    }
  )
];

const deleteChannel: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { serverId, channelId } = req.params;

      const authorized = await serverService.checkPermissions(serverId, req.user!._id, ['manageChannels']);

      if (!authorized) throw new CustomError(401, 'Unauthorized');

      await channelService.remove(serverId, channelId);

      res.json({
        message: 'Channel successfully deleted.',
      });
    }
  )
]

export default {
  createChannel,
  updateChannel,
  deleteChannel,
};