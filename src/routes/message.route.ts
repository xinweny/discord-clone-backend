import { Router } from 'express';

import MessageController from '../controllers/message.controller';

import ReactionRouter from './reaction.route';

const MessageRouter = Router();

MessageRouter.get('/', MessageController.getMessages);

MessageRouter.post('/', MessageController.createMessage);

MessageRouter.use('/:messageId/reactions', ReactionRouter);

MessageRouter.get('/:messageId', MessageController.getMessage);

MessageRouter.put('/:messageId', MessageController.updateMessage);

export default MessageRouter;