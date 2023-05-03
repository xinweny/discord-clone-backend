import { RequestHandler } from 'express';
import tryCatch from '../middleware/tryCatch';

const login: RequestHandler = tryCatch(
  (req, res, next) => {
    console.log('hello');
    console.log(req, res, next);
  }
);

const AuthController = {
  login,
};

export default AuthController;