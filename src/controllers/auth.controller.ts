import { RequestHandler } from 'express';

import env from '../config/env.config';

import validateFields from '../validators/validateFields';
import handleValidationErrors from '../validators/handleValidationErrors';

import passwordResetMail from '../data/templates/passwordResetMail';

import tryCatch from '../middleware/tryCatch';

import CustomError from '../helpers/CustomError';

import UserService from '../services/user.service';
import MailService from '../services/mail.service';
import AuthService from '../services/auth.service';

const signup: RequestHandler[] = [
  ...validateFields(['email', 'username', 'password', 'confirmPassword']),
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
  ...validateFields(['email', 'password']),
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
  ...validateFields(['refreshToken']),
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const decodedToken = await AuthService.verifyRefreshToken(req.body.refreshToken);

      if (!decodedToken) throw new CustomError(401, 'Invalid refresh token.');

      const { uid, email, username, role } = decodedToken;

      const payload = { uid, email, username, role };

      const accessToken = AuthService.issueAccessToken(payload);

      res.json({
        data: accessToken,
        message: 'Access token issued successfully.',
      });
    }
  )
];

const logout: RequestHandler[] = [
  ...validateFields(['refreshToken']),
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
  ...validateFields(['email']),
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const { email } = req.body;

      const user = await UserService.getUser({ email });

      if (!user) throw new CustomError(400, 'User does not exist.');

      const id = user._id.toString();
      const resetToken = await AuthService.issueResetToken(id);
      const clientURL = `${env.HOST}:${env.PORT}`;

      const link = `${clientURL}/api/v1/resetPassword?token=${resetToken}&uid=${id}`;

      const mail = await MailService.sendMail(
        email,
        'Discord Clone Password Reset Request',
        passwordResetMail(user.username, link)
      );

      res.json({
        data: mail,
        message: 'Email sent successfully.'
      });
    }
  )
];

const resetPassword: RequestHandler[] = [
  ...validateFields(['password', 'confirmPassword']),
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      if (!req.query.token || !req.query.uid) throw new CustomError(404, 'Not found.');

      const token = req.query.token.toString();
      const uid = req.query.uid.toString();

      const refreshToken = await AuthService.verifyResetToken(token, uid);

      if (!refreshToken) throw new CustomError(401, 'Invalid password reset token.');

      const hashedPassword = await AuthService.hashPassword(req.body.password);

      const user = await UserService.updateUser(uid, {
        password: hashedPassword,
      });

      if (!user) throw new CustomError(400, 'Bad request');

      await AuthService.deleteRefreshToken(refreshToken);

      res.json({
        data: user,
        message: 'Password changed successfully.',
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
  resetPassword,
};