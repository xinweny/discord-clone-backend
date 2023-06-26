import { Router } from 'express';

import mutualsController from '../controllers/mutuals.controller';

const mutualsRouter = Router({ mergeParams: true });

mutualsRouter.get('/:userId2/friends', mutualsController.getMutualFriends);

mutualsRouter.get('/:userId2/servers', mutualsController.getMutualFriends);

export default mutualsRouter;