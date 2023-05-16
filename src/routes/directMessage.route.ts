import { Router } from 'express';

import DirectMessageController from '../controllers/directMessage.controller';

const DirectMessageRouter = Router();

DirectMessageRouter.post('/', DirectMessageController.createRoom);

export default DirectMessageRouter;