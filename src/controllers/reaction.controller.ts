import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

import CustomError from '../helpers/CustomError';

import messageService from '../services/message.service';
import reactionService from '../services/reaction.service';

const reactToMessage: RequestHandler[] = [
  authenticate,
  authorize.message('react'),
  tryCatch(
    async (req, res) => {
      const { messageId } = req.params;

      const custom = !!req.body.emojiId;

      const createQuery = {
        messageId,
        reactorId: req.user?._id,
        ...(custom ? { emojiId: req.body.emojiId }  : { emoji: req.body.emoji }),
      };

      const userHasReacted = await reactionService.getOne(createQuery);

      if (userHasReacted) throw new CustomError(400, 'Reaction already exists.');
  
      const [, reaction] = await Promise.all([
        messageService.react(
          messageId,
          custom ? { ...req.body } : req.body.emoji
        ),
        reactionService.create(createQuery),
      ]);

      res.json({
        data: reaction,
        message: 'Reacted to message successfully.',
      });
    }
  )
];

const unreactToMessage: RequestHandler[] = [
  authenticate,
  authorize.message('view'),
  authorize.unreact,
  tryCatch(
    async (req, res) => {
      const { messageId, reactionId } = req.params;
      const { reaction } = req;

      const [message] = await Promise.all([
        messageService.unreact(messageId, reaction!),
        reactionService.remove(reactionId),
      ]);

      if (!message) throw new CustomError(400, 'Message not found.');

      res.json({
        data: reaction,
        message: 'Message unreacted successfully.',
      })
    }
  )
];

export default {
  reactToMessage,
  unreactToMessage,
};