import { Router } from 'express';

import authRouter from './auth.router';
import directMessageRouter from './directMessage.router';
import messageRouter from './message.router';
import serverRouter from './server.router';

const router = Router();

router.use('/', authRouter);

router.use('/dms', directMessageRouter);

router.use('/messages', messageRouter);

router.use('/servers', serverRouter);

export default router;