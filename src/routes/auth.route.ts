import { Router } from 'express';

import AuthController from '../controllers/auth.controller';

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/signup', AuthController.signup);

AuthRouter.post('/refreshToken', AuthController.refreshAccessToken);

AuthRouter.delete('/refreshToken', AuthController.logout);

export default AuthRouter;