import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';
import CustomError from '../helpers/CustomError';

import authenticate from '../middleware/authenticate';

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