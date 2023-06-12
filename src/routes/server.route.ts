import { Router } from 'express';

import serverMemberRouter from './serverMember.route';
import channelRouter from './channel.route';

import serverController from '../controllers/server.controller';

const serverRouter = Router({ mergeParams: true });

serverRouter.post('/', serverController.createServer);

serverRouter.use('/:serverId/members', serverMemberRouter);

serverRouter.use('/:serverId/channels', channelRouter);

serverRouter.put('/:serverId', serverController.updateServer);

serverRouter.delete('/:serverId', serverController.deleteServer);

export default serverRouter;