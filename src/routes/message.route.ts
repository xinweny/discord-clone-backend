import { Router } from 'express';

import MessageController from '../controllers/message.controller';

const MessageRouter = Router();

MessageRouter.post('/', MessageController.createMessage);

export default MessageRouter;