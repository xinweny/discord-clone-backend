import { Router } from 'express';

import channelController from '../controllers/channel.controller';

const channelRouter = Router({ mergeParams: true });

channelRouter.post('/', channelController.createChannel);

channelRouter.put('/:channelId', channelController.updateChannel);

channelRouter.delete('/:channelId', channelController.deleteChannel);

export default channelRouter;