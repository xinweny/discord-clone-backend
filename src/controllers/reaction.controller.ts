import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';

import CustomError from '../helpers/CustomError';

import { IReaction } from '../models/Reaction.model';

import messageService from '../services/message.service';
import reactionService from '../services/reaction.service';

const reactToMessage: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { messageId } = req.params;

      const custom = !!req.body.emojiId;

      const userHasReacted = await reactionService.getOne({
        reactorId: req.user?._id,
        messageId,
        ...(custom && { emojiId: req.body.emojiId }),
        ...(!!custom && { emoji: req.body.emoji }),
      });

      if (userHasReacted) throw new CustomError(400, 'Reaction already exists.');

      const createQuery = {
        messageId,
        reactorId: req.user?._id,
        ...(custom ? { emojiId: req.body.emojiId }  : { emoji: req.body.emoji }),
      };
  
      const [, reaction] = await Promise.all([
        messageService.react(messageId, custom ? {
          id: req.body.emojiId,
          name: req.body.name,
          url: req.body.url,
        } : req.body.emoji),
        reactionService.create(createQuery)
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
  tryCatch(
    async (req, res) => {
      const { messageId, reactionId } = req.params;

      const reaction = await reactionService.getById(reactionId) as IReaction;

      if (!reaction) throw new CustomError(400, 'Reaction not found.');

      if (req.user?._id.toString() !== reaction?.reactorId.toString()) throw new CustomError(401, 'Unauthorized');

      const [message] = await Promise.all([
        messageService.unreact(messageId, reaction),
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