import { Router } from 'express';

import serverOwnerController from '../controllers/serverOwner.controller';

const serverOwnerRouter = Router({ mergeParams: true });

serverOwnerRouter.put('/', serverOwnerController.changeServerOwnership);

export default serverOwnerRouter;