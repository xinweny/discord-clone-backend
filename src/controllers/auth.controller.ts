import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import CustomError from '../utils/CustomError';

const login: RequestHandler = tryCatch(
  async (req, res, next) => {
    throw new CustomError('hello', 404, { field: 'lol', message: 'lolol' });
    console.log(req, res, next);
  }
);

const AuthController = {
  login,
};

export default AuthController;