import { Router } from 'express';

import ReactionController from '../controllers/reaction.controller';

const ReactionRouter = Router({ mergeParams: true });

ReactionRouter.post('/', ReactionController.reactToMessage);

export default ReactionRouter;