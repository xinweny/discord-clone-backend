import { Router } from 'express';

import MessageController from '../controllers/message.controller';

const MessageRouter = Router();

MessageRouter.get('/', MessageController.getMessages);

MessageRouter.get('/:messageId', MessageController.getMessage);

MessageRouter.post('/', MessageController.createMessage);

MessageRouter.put('/:messageId', MessageController.updateMessage);

export default MessageRouter;