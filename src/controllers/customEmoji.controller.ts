import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import tryCatch from '../middleware/tryCatch';
import validateFields from '../middleware/validateFields';

import { uploadEmoji } from '../middleware/upload';

import customEmojiService from '../services/customEmoji.service';

const createEmoji: RequestHandler[] = [
  ...validateFields(['emojiName']),
  uploadEmoji,
  authenticate,
  authorize.server('manageExpressions'),
];

export default {
  createEmoji,
}