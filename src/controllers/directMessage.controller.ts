import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import tryCatch from '../middleware/tryCatch';

import DirectMessageService from '../services/directMessage.service';
import CustomError from '../helpers/CustomError';

const createRoom: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const roomExists = await DirectMessageService.exists({
        creatorId: req.body.creatorId,
        participantIds: req.body.participantIds,
      });

      if (roomExists) throw new CustomError(400, 'Direct message room already exists.');

      const directMessage = await DirectMessageService.create({
        creatorId: req.user!._id,
        ...req.body,
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