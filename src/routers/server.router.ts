import { Router } from 'express';

import serverMemberRouter from './serverMember.router';
import channelRouter from './channel.router';
import categoryRouter from './category.router';
import customEmojiRouter from './customEmoji.router';
import roleRouter from './role.router';

import serverController from '../controllers/server.controller';

const serverRouter = Router();

serverRouter.post('/', serverController.createServer);

serverRouter.use('/:serverId/members', serverMemberRouter);

serverRouter.use('/:serverId/channels', channelRouter);

serverRouter.use('/:serverId/categories', categoryRouter);

serverRouter.use('/:serverId/roles', roleRouter);

serverRouter.use('/:serverId/emojis', customEmojiRouter);

serverRouter.put('/:serverId', serverController.updateServer);

serverRouter.delete('/:serverId', serverController.deleteServer);

export default serverRouter;