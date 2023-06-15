import { Router } from 'express';

import directMessageController from '../controllers/directMessage.controller';

import messageRouter from './message.router';

const directMessageRouter = Router();

directMessageRouter.post('/', directMessageController.createRoom);

directMessageRouter.use('/:roomId/messages', messageRouter);

export default directMessageRouter;