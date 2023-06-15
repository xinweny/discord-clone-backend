import { Router } from 'express';

import customEmojiController from '../controllers/customEmoji.controller';

const customEmojiRouter = Router({ mergeParams: true });

customEmojiRouter.post('/', customEmojiController.createEmoji);

export default customEmojiRouter;