import { Router } from 'express';

import channelController from '../controllers/channel.controller';

const channelRouter = Router({ mergeParams: true });

channelRouter.post('/', channelController.createChannel);

export default channelRouter;