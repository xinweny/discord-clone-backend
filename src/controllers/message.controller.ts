import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import tryCatch from '../middleware/tryCatch';

import validateFields from '../validators/validateFields';
import handleValidationErrors from '../validators/handleValidationErrors';

import CustomError from '../helpers/CustomError';
import keepKeys from '../helpers/keepKeys';

import { io } from '../server';

import DirectMessageService from '../services/directMessage.service';
import MessageService from '../services/message.service';

const getMessage: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const message = await MessageService.getOne(req.params.messageId);
  
      if (!message) throw new CustomError(400, 'Message not found.');
  
      res.json({ data: message });
    }
  )
];

const getMessages: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const findQuery = keepKeys(req.query, ['roomId', 'senderId']);
  
      const messages = await MessageService.getMany(findQuery);
  
      res.json({ data: messages });
    }
  )
];

const createMessage: RequestHandler[] = [
  authenticate,
  ...validateFields(['body']),
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const { roomId } = req.body;
      const userId = req.user!._id;

      const isMember = DirectMessageService.checkMembership(userId, roomId);

      if (!isMember) throw new CustomError(401, 'Unauthorized');

      const message = await MessageService.create({
        senderId: userId,
        ...req.body,
      });

      io.in(roomId).emit('message:new', message);

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
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const { messageId } = req.params;
      const userId = req.user!._id;

      const message = await MessageService.getOne(messageId);

      if (!message) throw new CustomError(400, 'Message not found.');

      if (message._id !== userId) throw new CustomError(401, 'Unauthorized');

      const updateQuery = keepKeys(req.body, ['body', 'attachments']);

      const updatedMessage = await MessageService.update(messageId, updateQuery);

      io.in(message.roomId.toString()).emit('message:updated', message);

      res.json({
        data: updatedMessage,
        message: 'Message updated successfully.',
      });
    }
  )
];

const deleteMessage: RequestHandler = tryCatch(
  async (req, res, next) => {
    const { messageId } = req.params;

    const message = await MessageService.getOne(messageId);

    if (!message) throw new CustomError(400, 'Message not found.');

    if (message._id !== req.user!._id) throw new CustomError(401, 'Unauthorized');

    await MessageService.del(messageId);

    io.in(message.roomId.toString()).emit('message:deleted', message._id);

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