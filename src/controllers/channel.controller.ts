import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import validateFields from '../middleware/validateFields';
import tryCatch from '../middleware/tryCatch';

import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';
import serverMemberService from '../services/serverMember.service';
import channelService from '../services/channel.service';

const createChannel: RequestHandler[] = [
  authenticate,
  ...validateFields(['channelName']),
  tryCatch(
    async (req, res, next) => {
      const { serverId } = req.params;
      const userId = req.user!._id;

      const [server, member] = await Promise.all([
        serverService.getById(serverId),
        serverMemberService.getOne(userId, serverId),
      ]);

      if (!server) throw new CustomError(400, 'Server not found.');
      if (!member) throw new CustomError(400, 'Member not found.');
      if (!server.checkPermissions(member, ['manageChannels'])) throw new CustomError(401, 'Unauthorized');
      
      const channel = await channelService.create(serverId, { ...req.body });

      res.json({
        data: channel,
        message: 'Channel created successfully.',
      });
    }
  )
];

export default {
  createChannel,
  updateChannel,
  deleteChannel,
};