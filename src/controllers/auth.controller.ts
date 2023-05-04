import { RequestHandler } from 'express';

import validateUser from '../middleware/validateUser';
import checkValidation from '../middleware/checkValidation';
import tryCatch from '../middleware/tryCatch';
import CustomError from '../utils/CustomError';

import UserService from '../services/user.service';
import AuthService from '../services/auth.service';

const signup: RequestHandler[] = [
  ...validateUser,
  checkValidation,
  tryCatch(
    async (req, res, next) => {
      const { email, username, password } = req.body;

      const existingUser = await UserService.findOneUser({ email });

      if (existingUser) throw new CustomError('Email already in use. Please choose a different email.', 400);

      const hashedPassword = await AuthService.hashPassword(password);

      const newUser = await UserService.createUser(email, username, hashedPassword);

      res.json({
        data: newUser,
        message: 'User successfully created.',
      });
    }
  ),
];

const login: RequestHandler = tryCatch(
  async (req, res, next) => {
    console.log(req, res, next);
  }
);

export default {
  signup,
  login,
};