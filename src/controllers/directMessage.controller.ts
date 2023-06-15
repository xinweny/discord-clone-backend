import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import tryCatch from '../middleware/tryCatch';

import CustomError from '../helpers/CustomError';

import directMessageService from '../services/directMessage.service';

const createRoom: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { creatorId, participantIds } = req.body;

      const roomExists = await directMessageService.exists({
        creatorId,
        participantIds,
      });

      if (roomExists) throw new CustomError(400, 'Direct message room already exists.');

      const directMessage = await directMessageService.create({
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