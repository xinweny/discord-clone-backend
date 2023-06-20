import { Router } from 'express';

import relationRouter from './relation.router';

const userRouter = Router();

userRouter.use('/relations', relationRouter);

export default userRouter;