import { Router } from 'express';

import dmController from '../controllers/dm.controller';

import messageRouter from './message.router';
import participantRouter from './participant.router';

const dmRouter = Router();

dmRouter.post('/', dmController.createRoom);

dmRouter.use('/:roomId/messages', messageRouter);

dmRouter.use('/:dmId/participants', participantRouter);

dmRouter.get('/:dmId', dmController.getRoom);

dmRouter.put('/:dmId', dmController.updateRoom);

export default dmRouter;