import { Router } from 'express';

import AuthController from '../controllers/auth.controller';

const AuthRouter = Router();

AuthRouter.get('/login', AuthController.login);

AuthRouter.post('/signup', AuthController.signup);

export default AuthRouter;