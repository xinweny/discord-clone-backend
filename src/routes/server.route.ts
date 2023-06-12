import { Router } from 'express';

import serverMemberRouter from './serverMember.route';
import channelRouter from './channel.route';

import serverController from '../controllers/server.controller';

const serverRouter = Router();

serverRouter.post('/', serverController.createServer);

serverRouter.use('/:serverId/members', serverMemberRouter);

channelRouter.use('/:serverId/channels', channelRouter);

export default serverRouter;