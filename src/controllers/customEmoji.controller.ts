import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import tryCatch from '../middleware/tryCatch';
import { uploadEmoji } from '../middleware/upload';

import customEmojiService from '../services/customEmoji.service';

const createEmoji: RequestHandler[] = [
  authenticate,
  uploadEmoji,
];

export default {
  createEmoji,
}