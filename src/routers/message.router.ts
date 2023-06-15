import { Router } from 'express';

import messageController from '../controllers/message.controller';

import reactionRouter from './reaction.router';

const messageRouter = Router({ mergeParams: true });

messageRouter.get('/', messageController.getMessages);

messageRouter.post('/', messageController.createMessage);

messageRouter.use('/:messageId/reactions', reactionRouter);

messageRouter.get('/:messageId', messageController.getMessage);

messageRouter.put('/:messageId', messageController.updateMessage);

export default messageRouter;