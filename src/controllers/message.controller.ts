import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import tryCatch from '../middleware/tryCatch';
import validateFields from '../middleware/validateFields';

import CustomError from '../helpers/CustomError';
import keepKeys from '../helpers/keepKeys';

import directMessageService from '../services/directMessage.service';
import messageService from '../services/message.service';
import serverService from '../services/server.service';
import channelService from '../services/channel.service';

const getMessage: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const message = await messageService.getOne(req.params.messageId);
  
      if (!message) throw new CustomError(400, 'Message not found.');
  
      res.json({ data: message });
    }
  )
];

const getMessages: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const findQuery = keepKeys(req.query, ['roomId', 'senderId']);
  
      const messages = await messageService.getMany(findQuery);
  
      res.json({ data: messages });
    }
  )
];

const createMessage: RequestHandler[] = [
  authenticate,
  ...validateFields(['body']),
  tryCatch(
    async (req, res) => {
      const { roomId, serverId } = req.body;
      const userId = req.user?._id;

      let message;

      if (serverId) {
        const data = await serverService.checkPermissions(serverId, userId, ['sendMessages']);

        if (!data) throw new CustomError(401, 'Unauthorized');

        const { server, member } = data;

        const authorized = await channelService.checkPermissions(roomId, server, member);

        if (!authorized) throw new CustomError(401, 'Unauthorized');
  
        message = await messageService.create({
          senderId: member._id,
          ...req.body,
        }, 'CHANNEL');
      } else {
        const member = await directMessageService.checkMembership(userId, roomId);
  
        if (member) throw new CustomError(401, 'Unauthorized');
  
        message = await messageService.create({
          senderId: userId,
          ...req.body,
        }, 'DIRECT');
      }

      res.json({
        data: message,
        message: 'Message successfully sent.',
      });
    }
  )
];

const updateMessage: RequestHandler[] = [
  authenticate,
  ...validateFields(['body']),
  tryCatch(
    async (req, res) => {
      const { messageId } = req.params;
      const userId = req.user?._id;

      const message = await messageService.getOne(messageId);

      if (!message) throw new CustomError(400, 'Message not found.');

      if (message._id !== userId) throw new CustomError(401, 'Unauthorized');

      const updateQuery = keepKeys(req.body, ['body', 'attachments']);

      const updatedMessage = await messageService.update(messageId, updateQuery);

      res.json({
        data: updatedMessage,
        message: 'Message updated successfully.',
      });
    }
  )
];

const deleteMessage: RequestHandler = tryCatch(
  async (req, res) => {
    const { messageId } = req.params;

    const message = await messageService.getOne(messageId);

    if (!message) throw new CustomError(400, 'Message not found.');

    if (message._id !== req.user?._id) throw new CustomError(401, 'Unauthorized');

    await messageService.del(messageId);

    res.json({ message: 'Message deleted successfully.' });
  }
)

export default {
  getMessage,
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
}