import { Router } from 'express';

import dmController from '../controllers/dm.controller';

import messageRouter from './message.router';

const dmRouter = Router();

dmRouter.post('/', dmController.createRoom);

dmRouter.use('/:roomId/messages', messageRouter);

dmRouter.get('/:dmId', dmController.getRoom);

dmRouter.put('/:dmId', dmController.updateRoom);

export default dmRouter;