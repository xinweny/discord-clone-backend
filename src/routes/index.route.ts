import { Router } from 'express';

import AuthRouter from './auth.route';
import DirectMessageRouter from './directMessage.route';
import MessageRouter from './message.route';

const router = Router();

router.use('/', AuthRouter);

router.use('/dms', DirectMessageRouter);

router.use('/messages', MessageRouter);

export default router;