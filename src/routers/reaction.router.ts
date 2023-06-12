import { Router } from 'express';

import reactionController from '../controllers/reaction.controller';

const reactionRouter = Router({ mergeParams: true });

reactionRouter.post('/', reactionController.reactToMessage);

reactionRouter.delete('/:reactionId', reactionController.unreactToMessage);

export default reactionRouter;