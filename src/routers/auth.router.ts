import { Router } from 'express';

import authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', authController.login);

authRouter.post('/signup', authController.signup);

authRouter.post('/refresh', authController.refreshAccessToken);

authRouter.delete('/logout', authController.logout);

authRouter.post('/reqReset', authController.requestPasswordReset);

authRouter.post('/reset', authController.resetPassword);

authRouter.post('/reqVerify', authController.requestEmailVerification);

authRouter.post('/verify', authController.verifyEmail);

export default authRouter;