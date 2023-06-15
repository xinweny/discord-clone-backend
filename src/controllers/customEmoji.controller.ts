import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import tryCatch from '../middleware/tryCatch';
import validateFields from '../middleware/validateFields';
import { uploadEmoji } from '../middleware/upload';

import CustomError from '../helpers/CustomError';

import customEmojiService from '../services/customEmoji.service';


const createEmoji: RequestHandler[] = [
  uploadEmoji,
  ...validateFields(['emojiName']),
  authenticate,
  authorize.server('manageExpressions'),
  tryCatch(
    async (req, res) => {
      if (!req.file) throw new CustomError(400, 'File not found.');

      const emoji = await customEmojiService.create(req.params.serverId, req.file, {
        creatorId: req.member!._id,
        name: req.body.name,
      });

      res.json({
        data: emoji,
        message: 'Emoji successfully created.',
      });
    }
  )
];

export default {
  createEmoji,
}