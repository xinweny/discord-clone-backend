import { Router } from 'express';

import directMessageController from '../controllers/directMessage.controller';

const directMessageRouter = Router();

directMessageRouter.post('/', directMessageController.createRoom);

export default directMessageRouter;