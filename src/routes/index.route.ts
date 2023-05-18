import { Router } from 'express';

import AuthRouter from './auth.route';
import DirectMessageRouter from './directMessage.route';
import MessageRouter from './message.route';

const router = Router();

router.use('/', AuthRouter);

router.use('/dm', DirectMessageRouter);

router.use('/message', MessageRouter);

export default router;