import { Router } from 'express';

import directMessageController from '../controllers/directMessage.controller';

const DirectMessageRouter = Router();

DirectMessageRouter.post('/', directMessageController.createChat);

export default DirectMessageRouter;