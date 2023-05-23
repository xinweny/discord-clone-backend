import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';
import { io } from '../server';

import MessageService from '../services/message.service';
import ReactionService from '../services/reaction.service';

const reactToMessage: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const { messageId } = req.params;
  
      const custom = !!req.body.emojiId;

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
        io.in(message.roomId.toString()).emit('reaction:created', reaction);
      }

      res.json({
        data: reaction,
        message: 'Reacted to message successfully.',
      });
    }
  )
];

export default {
  reactToMessage,
};