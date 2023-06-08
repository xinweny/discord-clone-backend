import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';

import CustomError from '../helpers/CustomError';

import userService from '../services/user.service';
import serverService from '../services/server.service';
import serverMemberService from '../services/serverMember.service';

const joinServer: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const { serverId } = req.params;

      const server = await serverService.getById(serverId);

      if (!server) throw new CustomError(500, 'Server not found.');

      const user = await userService.getById(req.user!._id);

      if (!user) throw new CustomError(500, 'User not found.');

      const member = await serverMemberService.create({
        userId: user._id,
        displayName: user.username,
        serverId,
      });

      res.json({
        data: { member, server },
        message: 'Server joined successfully.',
      });
    }
  )
];

const editServerProfile: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const member = await serverMemberService.update(req.user!._id, { ...req.body });

      res.json({
        data: member,
        message: 'Server member info successfully updated.',
      });
    }
  )
];

const leaveServer: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const { serverId } = req.body;
      const userId = req.user!._id;

      const isMember = await serverMemberService.checkMembership(userId, serverId);

      if (!isMember) throw new CustomError(400, 'User is not a member of this server.');

      const member = await serverMemberService.remove(userId, serverId);

      res.json({
        data: member,
        message: 'User left server successfully.',
      });
    }
  )
];

export default {
  joinServer,
  leaveServer,
  editServerProfile,
};