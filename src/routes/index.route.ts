import { Router } from 'express';

import authRouter from './auth.route';
import directMessageRouter from './directMessage.route';
import messageRouter from './message.route';
import serverRouter from './server.route';

const router = Router();

router.use('/', authRouter);

router.use('/dms', directMessageRouter);

router.use('/messages', messageRouter);

router.use('/servers', serverRouter);

export default router;