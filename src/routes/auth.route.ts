import { Router } from 'express';

import AuthController from '../controllers/auth.controller';

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/signup', AuthController.signup);

AuthRouter.post('/refresh', AuthController.refreshAccessToken);

AuthRouter.delete('/refresh', AuthController.logout);

AuthRouter.post('/reqReset', AuthController.requestPasswordReset);

AuthRouter.post('/reset', AuthController.resetPassword);

AuthRouter.post('/reqVerify', AuthController.requestEmailVerification);

AuthRouter.post('/verify', AuthController.verifyEmail);

export default AuthRouter;