import { RequestHandler } from 'express';

import signupValidation from '../validators/signupValidation';
import loginValidation from '../validators/loginValidation';
import refreshValidation from '../validators/refreshValidation';
import handleValidationErrors from '../validators/handleValidationErrors';
import tryCatch from '../middleware/tryCatch';
import CustomError from '../helpers/CustomError';

import UserService from '../services/user.service';
import AuthService from '../services/auth.service';

const signup: RequestHandler[] = [
  ...signupValidation,
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const { email, username, password } = req.body;

      const existingUser = await UserService.getUser({ email });

      if (existingUser) throw new CustomError(400, 'Email already in use. Please choose a different email.');

      const hashedPassword = await AuthService.hashPassword(password);

      const newUser = await UserService.createUser(email, username, hashedPassword);

      res.json({
        data: newUser,
        message: 'User successfully created.',
      });
    }
  ),
];

const login: RequestHandler[] = [
  ...loginValidation,
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const { email, password } = req.body;

      const user = await UserService.getUser({ email }, true);
      if (!user) throw new CustomError(401, 'Invalid email or password.');

      const verifiedPassword = await AuthService.verifyPassword(password, user.password);
      if (!verifiedPassword) throw new CustomError(401, 'Invalid email or password.');

      const { accessToken, refreshToken } = await AuthService.generateTokens(user);

      res.json({
        data: {
          accessToken,
          refreshToken,
        },
        message: 'Logged in successfully.',
      });
    }
  )
];

const refreshAccessToken: RequestHandler[] = [
  ...refreshValidation,
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const decodedToken = await AuthService.verifyRefreshToken(req.body.refreshToken);

      if (!decodedToken) throw new CustomError(401, 'Invalid refresh token.');

      const { _id, email, username, role } = decodedToken;

      const payload = { _id, email, username, role };

      const accessToken = AuthService.issueAccessToken(payload);

      res.json({
        data: accessToken,
        message: 'Access token issued successfully.',
      });
    }
  )
];

const logout: RequestHandler[] = [
  ...refreshValidation,
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      await AuthService.deleteRefreshToken(req.body.refreshToken);

      res.json({
        data: {},
        message: 'Logged out successfully.',
      });
    }
  )
];

export default {
  signup,
  login,
  refreshAccessToken,
  logout,
};