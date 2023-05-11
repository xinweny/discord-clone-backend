import { Router } from 'express';

import DirectMessageController from '../controllers/directMessage.controller';

const DirectMessageRouter = Router();

DirectMessageRouter.post('/', DirectMessageController.createChat);

export default DirectMessageRouter;