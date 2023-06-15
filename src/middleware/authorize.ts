import { RequestHandler } from 'express';

import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';
import serverMemberService from '../services/serverMember.service';
import channelService from '../services/channel.service';
import directMessageService from '../services/directMessage.service';

const server = (permissionNames: string | string[] = []) => {
  const authorizeMiddleware: RequestHandler = async (req, res, next) => {
    const { serverId, memberId } = req.params;

    const permissions = (typeof permissionNames === 'string') ? [permissionNames] : permissionNames;

    const authorized = await serverService.checkPermissions(serverId, req.user?._id, permissions, memberId);

    if (!authorized) throw new CustomError(401, 'Unauthorized');

    req.server = authorized.server;
    req.member = authorized.member;

    next();
  };

  return authorizeMiddleware;
};

const memberSelf: RequestHandler = async (req, res, next) => {
  const { memberId } = req.params;

  const member = await serverMemberService.getById(memberId);

  if (!member) throw new CustomError(400, 'User is not a member of this server.');

  if (!member.userId.equals(req.user?._id)) throw new CustomError(401, 'Unauthorized');

  req.member = member;

  next();
};

const message: RequestHandler = async (req, res, next) => {
  const { roomId, serverId } = req.params;
  const userId = req.user?._id;

  if (serverId) {
    const data = await serverService.checkPermissions(serverId, userId, ['sendMessages']);

    if (!data) throw new CustomError(401, 'Unauthorized');
  
    const { server, member } = data;
  
    const authorized = channelService.checkPermissions(roomId, server, member);
  
    if (!authorized) throw new CustomError(401, 'Unauthorized');

    req.server = data.server;
    req.member = data.member;
  
  } else {
    const directMessage = await directMessageService.checkMembership(userId, roomId);
  
    if (!directMessage) throw new CustomError(401, 'Unauthorized');

    req.dm = directMessage;
  }

  next();
};

export default {
  server,
  memberSelf,
  message,
}