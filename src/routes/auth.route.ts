import { Router } from 'express';

import AuthController from '../controllers/auth.controller';

const AuthRouter = Router();

AuthRouter.get('/login', AuthController.login);

export default AuthRouter;