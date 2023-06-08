import { Router } from 'express';

import serverMemberRouter from './serverMember.route';

import serverController from '../controllers/server.controller';

const serverRouter = Router();

serverRouter.post('/', serverController.createServer);

serverRouter.use('/:serverId/members', serverMemberRouter);

export default serverRouter;