import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';
import CustomError from '../helpers/CustomError';

import { io } from '../server';

import MessageService from '../services/message.service';
import ReactionService from '../services/reaction.service';


const reactToMessage: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const { messageId } = req.params;

      const custom = !!req.body.emojiId;

      const userHasReacted = await ReactionService.getOne({
        reactorId: req.user?._id,
        messageId,
        ...(custom && { emojiId: req.body.emojiId }),
        ...(!!custom && { emoji: req.body.emoji }),
      });

      if (userHasReacted) throw new CustomError(400, 'Reaction already exists.');

      const createQuery = {
        messageId,
        reactorId: req.user!._id,
        ...(custom ? { emojiId: req.body.emojiId }  : { emoji: req.body.emoji }),
      };
  
      const [message, reaction] = await Promise.all([
        MessageService.react(messageId, custom ? {
          id: req.body.emojiId,
          name: req.body.name,
          url: req.body.url,
        } : req.body.emoji),
        ReactionService.create(createQuery)
      ]);

      if (message) {
        io.in(message.roomId.toString()).emit('reaction', {
          data: reaction,
          action: 'POST',
        });
      }

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
    async (req, res, next) => {
      const { messageId, reactionId } = req.params;

      const reaction = await ReactionService.getOneById(reactionId);

      if (!reaction) throw new CustomError(400, 'Reaction not found.');

      if (req.user!._id.toString() !== reaction?.reactorId.toString()) throw new CustomError(401, 'Unauthorized');

      const [message] = await Promise.all([
        MessageService.unreact(messageId, reaction),
        ReactionService.remove(reactionId)
      ]);

      if (!message) throw new CustomError(400, 'Message not found.');

      io.in(message.roomId.toString()).emit('reaction', {
        data: reaction._id,
        action: 'DELETE',
      });

      res.json({
        data: reaction,
        message: 'Message unreacted successfully.',
      })
    }
  )
]

export default {
  reactToMessage,
  unreactToMessage,
};