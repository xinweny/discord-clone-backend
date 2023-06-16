import { RequestHandler } from 'express';

import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';
import serverMemberService from '../services/serverMember.service';
import channelService from '../services/channel.service';
import directMessageService from '../services/directMessage.service';
import messageService from '../services/message.service';

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

const serverMember: RequestHandler = async (req, res, next) => {
  const member = await serverMemberService.getOne(req.user?._id, req.params.serverId);

  if (!member) throw new CustomError (401, 'Unauthorized');

  req.member = member;

  next();
};

const serverOwner: RequestHandler = async (req, res, next) => {
  const { serverId } = req.params;

  const member = await serverMemberService.getOne(req.user?._id, serverId);

  if (!member) throw new CustomError (401, 'Unauthorized');

  const server = await serverService.getById(serverId);

  if (!server?.ownerId.equals(member._id)) throw new CustomError (401, 'Unauthorized');

  req.server = server;
  req.member = member;

  next();
};

const memberSelf: RequestHandler = async (req, res, next) => {
  const { memberId } = req.params;

  const member = await serverMemberService.getById(memberId);

  if (!member || !member.userId.equals(req.user?._id)) throw new CustomError(401, 'Unauthorized');

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

const messageSelf: RequestHandler = async (req, res, next) => {
  const { serverId } = req.params;
  
  const message = await messageService.getOne(req.params.messageId);

  if (!message) throw new CustomError(400, 'Message not found.');

  if (!serverId && message._id !== req.user?._id
    || serverId 
  ) throw new CustomError(401, 'Unauthorized');

  next();
};

const user: RequestHandler = (req, res, next) => {
  const { userId } = req.params;

  if (!req.user?._id.equals(userId)) throw new CustomError(401, 'Unauthorized');

  next();
};

export default {
  server,
  serverMember,
  serverOwner,
  memberSelf,
  message,
  messageSelf,
  user,
}