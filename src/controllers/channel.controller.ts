import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validateFields from '../middleware/validateFields';
import tryCatch from '../middleware/tryCatch';

import channelService from '../services/channel.service';

const createChannel: RequestHandler[] = [
  ...validateFields(['channelName']),
  authenticate,
  authorize.server('manageChannels'),
  tryCatch(
    async (req, res) => {
      const channel = await channelService.create(req.params.serverId, { ...req.body });

      res.json({
        data: channel,
        message: 'Channel created successfully.',
      });
    }
  )
];

const updateChannel: RequestHandler[] = [
  ...validateFields(['channelName']),
  authenticate,
  authorize.server('manageChannels'),
  tryCatch(
    async (req, res) => {
      const { serverId, channelId } = req.params;
      
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
  authorize.server('manageChannels'),
  tryCatch(
    async (req, res) => {
      const { serverId, channelId } = req.params;

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