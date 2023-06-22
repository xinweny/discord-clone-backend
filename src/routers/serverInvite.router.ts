import { Router } from 'express';

import serverInviteController from '../controllers/serverInvite.controller';

const serverInviteRouter = Router({ mergeParams: true });

serverInviteRouter.get('/', serverInviteController.getInvite);

serverInviteRouter.put('/', serverInviteController.updateInviteUrlId);

export default serverInviteRouter;