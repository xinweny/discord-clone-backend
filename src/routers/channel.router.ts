import { Router } from 'express';

import channelController from '../controllers/channel.controller';

import messageRouter from './message.router';

const channelRouter = Router({ mergeParams: true });

channelRouter.post('/', channelController.createChannel);

channelRouter.use('/:roomId/messages', messageRouter);

channelRouter.put('/:channelId', channelController.updateChannel);

channelRouter.delete('/:channelId', channelController.deleteChannel);

export default channelRouter;