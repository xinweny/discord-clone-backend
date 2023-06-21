import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';
import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';
import serverMemberService from '../services/serverMember.service';
import channelService from '../services/channel.service';
import directMessageService from '../services/directMessage.service';
import messageService from '../services/message.service';
import reactionService from '../services/reaction.service';

const server = (permissionKeys: string | string[] = []) => {
  const authorizeMiddleware: RequestHandler = async (req, res, next) => {
    const { serverId, memberId } = req.params;

    const authorized = await serverService.checkPermissions(serverId, req.user?._id, permissionKeys, memberId);

    if (!authorized) throw new CustomError(401, 'Unauthorized');

    req.server = authorized.server;
    req.member = authorized.member;

    next();
  };

  return tryCatch(authorizeMiddleware);
};

const serverMember: RequestHandler = tryCatch(
  async (req, res, next) => {
    const member = await serverMemberService.getOne(req.user?._id, req.params.serverId);
  
    if (!member) throw new CustomError (401, 'Unauthorized');
  
    req.member = member;
  
    next();
  }
);

const serverOwner: RequestHandler = tryCatch(
  async (req, res, next) => {
    const { serverId } = req.params;
  
    const member = await serverMemberService.getOne(req.user?._id, serverId);
  
    if (!member) throw new CustomError (401, 'Unauthorized');
  
    const server = await serverService.getById(serverId);
  
    if (!server?.ownerId.equals(member._id)) throw new CustomError (401, 'Unauthorized');
  
    req.server = server;
    req.member = member;
  
    next();
  }
);

const memberSelf: RequestHandler = tryCatch(
  async (req, res, next) => {
    const { memberId } = req.params;
  
    const member = await serverMemberService.checkMembership(req.user?._id, memberId);
  
    if (!member) throw new CustomError(401, 'Unauthorized');
  
    req.member = member;
  
    next();
  }
);

const message = (action: 'view' | 'send' | 'react') => {
  const authorizeMiddleware: RequestHandler = async (req, res, next) => {
    const { roomId, serverId } = req.params;
    const userId = req.user?._id;

    const serverPermission = {
      view: 'viewChannels',
      send: 'sendMessages',
      react: 'addReactions',
    };
  
    if (serverId) {
      const data = await serverService.checkPermissions(
        serverId,
        userId,
        serverPermission[action],
      );
  
      if (!data) throw new CustomError(401, 'Unauthorized');
    
      const { server, member } = data;
    
      const authorized = channelService.checkPermissions(
        roomId,
        server,
        member,
        (action === 'view') ? 'view' : 'message'
      );
    
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

  return tryCatch(authorizeMiddleware);
}

const messageSelf = (action: 'update' | 'delete') => {
  const authorizeMiddleware: RequestHandler = async (req, res, next) => {
    const { serverId, messageId } = req.params;
  
    const message = await messageService.getOne(messageId);
  
    if (!message) throw new CustomError(400, 'Message not found.');
  
    if (serverId) {
      const userId = req.user?._id;
      const memberId = message.senderId;

      const authorized = (action === 'delete')
      ? await serverService.checkPermissions(
        serverId,
        userId,
        'manageMessages',
        memberId
      )
      : await serverMemberService.checkMembership(
        userId,
        memberId
      );
  
      if (!authorized) throw new CustomError(401, 'Unauthorized');
    } else if (!message.senderId.equals(req.user?._id)) {
      throw new CustomError(401, 'Unauthorized');
    }
  
    next();
  };

  return tryCatch(authorizeMiddleware);
}

const unreact: RequestHandler = tryCatch(
  async (req, res, next) => {
    const reaction = await reactionService.getById(req.params.reactionId);
  
    if (!reaction) throw new CustomError(400, 'Reaction not found.');
  
    if (req.user?._id.toString() !== reaction?.reactorId.toString()) throw new CustomError(401, 'Unauthorized');
  
    req.reaction = reaction;
  
    next();
  }
);

const user: RequestHandler = tryCatch(
  (req, res, next) => {
    const { userId } = req.params;
  
    if (!req.user?._id.equals(userId)) throw new CustomError(401, 'Unauthorized');
  
    next();
  }
);

export default {
  server,
  serverMember,
  serverOwner,
  memberSelf,
  message,
  messageSelf,
  user,
  unreact,
};