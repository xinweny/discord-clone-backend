import { Router } from 'express';

import AuthRouter from './auth.route';
import DirectMessageRouter from './directMessage.route';

const router = Router();

router.use('/', AuthRouter);
router.use('/dm', DirectMessageRouter);

export default router;