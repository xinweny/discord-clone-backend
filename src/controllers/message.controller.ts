import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import tryCatch from '../middleware/tryCatch';
import validateFields from '../validators/validateFields';
import CustomError from '../helpers/CustomError';

import DirectMessageService from '../services/directMessage.service';
import MessageService from '../services/message.service';

const createMessage: RequestHandler[] = [
  authenticate,
  ...validateFields(['body']),
  tryCatch(
    async (req, res, next) => {
      const { userId, roomId } = req.body;

      const isMember = DirectMessageService.checkMembership(userId, roomId);

      if (!isMember) throw new CustomError(401, 'Unauthorized');

      const message = await MessageService.create({
        senderId: req.user!._id,
        ...req.body,
      });

      res.json({
        data: message,
        message: 'Message successfully sent.',
      });
    }
  )
];

export default {
  createMessage,
}