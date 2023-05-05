import { RequestHandler } from 'express';

import env from '../config/env.config';

import signupValidation from '../validators/signupValidation';
import loginValidation from '../validators/loginValidation';
import refreshValidation from '../validators/refreshValidation';
import resetValidation from '../validators/resetValidation';
import handleValidationErrors from '../validators/handleValidationErrors';

import passwordResetMail from '../data/templates/passwordResetMail';

import tryCatch from '../middleware/tryCatch';

import CustomError from '../helpers/CustomError';

import UserService from '../services/user.service';
import MailService from '../services/mail.service';
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
      const decodedToken = await AuthService.verifyToken(req.body.refreshToken, 'REFRESH');

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

const requestPasswordReset: RequestHandler[] = [
  ...resetValidation,
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const { email } = req.body;

      const user = await UserService.getUser({ email });

      if (!user) throw new CustomError(400, 'User does not exist.');

      const id = user._id.toString();
      const resetToken = await AuthService.issueResetToken(id);
      const clientURL = `${env.HOST}:${env.PORT}`;

      const link = `${clientURL}/passwordReset?token=${resetToken}&id=${id}`;

      const mail = await MailService.sendMail(
        email,
        'Discord Clone Password Reset',
        passwordResetMail(user.username, link)
      );

      res.json({
        data: mail,
        message: 'Email sent successfully.'
      });
    }
  )
];

export default {
  signup,
  login,
  refreshAccessToken,
  logout,
  requestPasswordReset,
};