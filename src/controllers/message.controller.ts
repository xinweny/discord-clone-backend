import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';
import CustomError from '../helpers/CustomError';
import keepKeys from '../helpers/keepKeys';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validateFields from '../middleware/validateFields';
import upload from '../middleware/upload';

import messageService from '../services/message.service';

const getMessage: RequestHandler[] = [
  authenticate,
  authorize.message('view'),
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

const createMessage: RequestHandler[] = [
  upload.attachments,
  ...validateFields(['body']),
  authenticate,
  authorize.message('send'),
  tryCatch(
    async (req, res) => {
      const { roomId, serverId } = req.params;
      const userId = req.user?._id;

      const message = await messageService.create({
        senderId: (serverId) ? req.member?._id : userId,
        roomId,
        body: req.body.body,
      }, req.files, serverId);

      res.json({
        data: message,
        message: 'Message successfully sent.',
      });
    }
  )
];

const updateMessage: RequestHandler[] = [
  ...validateFields(['body']),
  authenticate,
  authorize.messageSelf('update'),
  tryCatch(
    async (req, res) => {
      const updateQuery = keepKeys(req.body, ['body', 'attachments']);

      const message = await messageService.update(req.params.messageId, updateQuery);

      res.json({
        data: message,
        message: 'Message updated successfully.',
      });
    }
  )
];

const deleteMessage: RequestHandler[] = [
  authenticate,
  authorize.messageSelf('delete'),
  tryCatch(
    async (req, res) => {  
      await messageService.remove(req.params.messageId);
  
      res.json({ message: 'Message deleted successfully.' });
    }
  )
];

export default {
  getMessage,
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
}