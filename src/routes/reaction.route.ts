import { Router } from 'express';

import ReactionController from '../controllers/reaction.controller';

const ReactionRouter = Router({ mergeParams: true });

ReactionRouter.post('/', ReactionController.reactToMessage);

ReactionRouter.delete('/:reactionId', ReactionController.unreactToMessage);

export default ReactionRouter;