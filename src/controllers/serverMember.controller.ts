import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validateFields from '../middleware/validateFields';

import CustomError from '../helpers/CustomError';

import userService from '../services/user.service';
import serverService from '../services/server.service';
import serverMemberService from '../services/serverMember.service';

const joinServer: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { serverId } = req.params;

      const [server, user] = await Promise.all([
        serverService.getById(serverId),
        userService.getById(req.user?._id),
      ]);

      if (!server) throw new CustomError(500, 'Server not found.');
      if (!user) throw new CustomError(500, 'User not found.');

      const member = await serverMemberService.create({
        userId: user._id,
        displayName: user.displayName,
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
  ...validateFields(['displayName', 'bio', 'bannerColor']),
  authenticate,
  authorize.memberSelf,
  tryCatch(
    async (req, res) => {
      const updatedMember = await serverMemberService.update(req.params.memberId, { ...req.body });

      res.json({
        data: updatedMember,
        message: 'Server member info successfully updated.',
      });
    }
  )
];

const leaveServer: RequestHandler[] = [
  authenticate,
  authorize.server('kickMembers'),
  tryCatch(
    async (req, res) => {
      const { memberId } = req.params;

      if (req.server?.ownerId.equals(memberId)) throw new CustomError(400, 'Server creator cannot leave server. Please transfer server ownership first.');

      await serverMemberService.remove(memberId);

      res.json({
        data: req.member,
        message: 'User removed from server successfully.',
      });
    }
  )
];

export default {
  joinServer,
  leaveServer,
  editServerProfile,
};