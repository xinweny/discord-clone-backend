import { Router } from 'express';

import AuthController from '../controllers/auth.controller';

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/signup', AuthController.signup);

AuthRouter.post('/refresh', AuthController.refreshAccessToken);

export default AuthRouter;