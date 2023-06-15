import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import tryCatch from '../middleware/tryCatch';
import validateFields from '../middleware/validateFields';

import CustomError from '../helpers/CustomError';
import keepKeys from '../helpers/keepKeys';

import messageService from '../services/message.service';

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
      const findQuery = keepKeys(req.query, ['senderId']);
  
      const messages = await messageService.getMany({
        roomId: req.params.roomId,
        ...findQuery,
      });
  
      res.json({ data: messages });
    }
  )
];

// TODO: add attachments

const createMessage: RequestHandler[] = [
  ...validateFields(['body']),
  authenticate,
  authorize.message,
  tryCatch(
    async (req, res) => {
      const { roomId, serverId } = req.params;
      const userId = req.user?._id;

      const message = await messageService.create({
        senderId: (serverId) ? req.member?._id : userId,
        roomId,
        ...req.body,
      }, (serverId) ? 'CHANNEL' : 'DIRECT');

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