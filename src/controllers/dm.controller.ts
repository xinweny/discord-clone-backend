import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import upload from '../middleware/upload';

import dmService from '../services/dm.service';

const getRoom: RequestHandler[] = [
  authenticate,
  authorize.dmMember,
  tryCatch(
    async (req, res) => {
      res.json({ data: req.dm });
    }
  )
];

const createRoom: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { participantIds } = req.body;

      participantIds.unshift(req.user?._id);

      const dm = await dmService.create(participantIds);

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
  authorize.dmMember,
];

export default {
  getRoom,
  createRoom,
  updateRoom,
};