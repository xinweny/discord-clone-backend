import { Router } from 'express';

import relationRouter from './relation.router';

import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/:userId/mutuals/:userId2', userController.getMutualFriends);

userRouter.use('/:userId/relations', relationRouter);

userRouter.get('/:userId', userController.getUser);

userRouter.put('/:userId', userController.updateUser);

export default userRouter;