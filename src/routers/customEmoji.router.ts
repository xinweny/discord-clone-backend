import { Router } from 'express';

import customEmojiController from '../controllers/customEmoji.controller';

const customEmojiRouter = Router({ mergeParams: true });

customEmojiRouter.get('/', customEmojiController.getEmojis);

customEmojiRouter.post('/', customEmojiController.createEmoji);

customEmojiRouter.delete('/:emojiId', customEmojiController.deleteEmoji);

export default customEmojiRouter;