import { Router } from 'express';

import serverController from '../controllers/server.controller';

const serverRouter = Router();

serverRouter.post('/', serverController.createServer);

export default serverRouter;