import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';
import CustomError from '../helpers/CustomError';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import upload from '../middleware/upload';

import dmService from '../services/dm.service';

const createRoom: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { ownerId, participantIds } = req.body;

      const roomExists = await dmService.exists({
        ownerId,
        participantIds,
      });

      if (roomExists) throw new CustomError(400, 'Direct message room already exists.');

      const dm = await dmService.create({
        ownerId: req.user?._id,
        ...req.body,
      });

      res.json({
        data: dm,
        message: 'Direct message chat successfully created.',
      });
    }
  )
];

const updateRoom: RequestHandler[] = [
  upload.avatar,
  authenticate,
  authorize.dmParticipant
]

export default {
  createRoom,
  updateRoom,
}