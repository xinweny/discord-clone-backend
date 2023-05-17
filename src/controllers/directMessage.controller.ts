import { RequestHandler } from 'express';

import { io } from '../server';
import authenticate from '../middleware/authenticate';
import tryCatch from '../middleware/tryCatch';

import DirectMessageService from '../services/directMessage.service';

const createRoom: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const directMessage = await DirectMessageService.create({
        creatorId: req.user!._id,
        ...req.body,
      });

      io.emit('direct_message:subscribe', {
        roomId: directMessage._id,
        participantIds: directMessage.participantIds,
      });

      res.json({
        data: directMessage,
        message: 'Direct message chat successfully created.',
      });
    }
  )
];

export default {
  createRoom,
}