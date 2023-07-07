import { Router } from 'express';

import authRouter from './auth.router';
import dmRouter from './dm.router';
import serverRouter from './server.router';
import userRouter from './user.router';

const router = Router();

router.use('/auth', authRouter);

router.use('/dms', dmRouter);

router.use('/servers', serverRouter);

router.use('/users', userRouter);

export default router;