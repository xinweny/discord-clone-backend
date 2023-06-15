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
    async (req, res) => {
      const { memberId } = req.params;

      const member = await serverMemberService.getById(memberId);

      if (!member) throw new CustomError(400, 'User is not a member of this server.');
      if (!member.userId.equals(req.user?._id)) throw new CustomError(401, 'Unauthorized');

      const updatedMember = await serverMemberService.update(memberId, { ...req.body });

      res.json({
        data: updatedMember,
        message: 'Server member info successfully updated.',
      });
    }
  )
];

const leaveServer: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { serverId, memberId } = req.params;
      const userId = req.user?._id;
      
      const authorized = await serverService.checkPermissions(serverId, userId, ['kickMembers'], memberId);

      if (!authorized) throw new CustomError(401, 'Unauthorized');

      const { member } = authorized;

      await serverMemberService.remove(memberId);

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