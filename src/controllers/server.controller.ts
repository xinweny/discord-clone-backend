import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';
import validateFields from '../middleware/validateFields';

import CustomError from '../helpers/CustomError';

import userService from '../services/user.service';
import serverMemberService from '../services/serverMember.service';
import serverService from '../services/server.service';

const createServer: RequestHandler[] = [
  authenticate,
  ...validateFields(['serverName']),
  tryCatch(
    async (req, res, next) => {
      const user = await userService.getUser({ _id: req.user!._id });

      if (!user) throw new CustomError(401, 'Unauthorized');

      const serverId = new mongoose.Types.ObjectId();

      console.log(serverId);

      const creator = await serverMemberService.create({
        userId: user._id,
        serverId,
        username: user.username,
      });

      const server = await serverService.create({
        _id: serverId,
        creatorId: creator._id,
        ...req.body,
      });

      res.json({
        data: {
          server,
          creator,
        },
        message: 'Server created successfully.',
      });
    }
  )
];

export default {
  createServer,
};