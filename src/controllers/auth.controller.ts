import { RequestHandler } from 'express';

import env from '../config/env.config';

import validateFields from '../validators/validateFields';
import handleValidationErrors from '../validators/handleValidationErrors';

import passwordResetMail from '../templates/passwordResetMail';
import emailVerificationMail from '../templates/emailVerificationMail';

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

      const newUser = await UserService.create({
        email,
        username,
        password: hashedPassword,
      });

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

      const { _id, email, username, role, verified } = decodedToken;

      const user = { _id, email, username, role, verified };

      const accessToken = AuthService.issueAccessToken(user);

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
      const resetToken = await AuthService.issueTempToken(id, 'RESET', 1800000);
      const clientURL = `${env.HOST}:${env.PORT}`;

      const link = `${clientURL}/api/v1/reset?token=${resetToken}&uid=${id}`;

      const mail = await MailService.sendMail(
        email,
        'Discord Clone Password Reset',
        passwordResetMail(user.username, link)
      );

      res.json({
        data: mail,
        message: 'Password reset email sent successfully.'
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

      const refreshToken = await AuthService.verifyTempToken(token, uid, 'RESET');

      if (!refreshToken) throw new CustomError(401, 'Invalid password reset token.');

      const hashedPassword = await AuthService.hashPassword(req.body.password);

      const user = await UserService.update(uid, {
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

const requestEmailVerification: RequestHandler[] = [
  ...validateFields(['email']),
  handleValidationErrors,
  tryCatch(
    async (req, res, next) => {
      const { email } = req.body;

      const user = await UserService.getUser({ email });

      if (!user) throw new CustomError(400, 'User does not exist.');

      const id = user._id.toString();
      const verifyToken = await AuthService.issueTempToken(id, 'VERIFY', 1800000);
      const clientURL = `${env.HOST}:${env.PORT}`;

      const link = `${clientURL}/api/v1/verify?token=${verifyToken}&uid=${id}`;

      const mail = await MailService.sendMail(
        email,
        'Discord Clone User Verification',
        emailVerificationMail(user.username, link)
      );

      res.json({
        data: mail,
        message: 'Email verification email sent successfully.'
      });
    }
  )
];

const verifyEmail: RequestHandler = tryCatch(
  async (req, res, next) => {
    if (!req.query.token || !req.query.uid) throw new CustomError(404, 'Not found.');

    const token = req.query.token.toString();
    const uid = req.query.uid.toString();

    const user = await UserService.getUser({ _id: uid });

    if (!user) throw new CustomError(400, 'User does not exist.');
    if (user.verified) throw new CustomError(400, 'User email has already been verified.');

    const hashedToken = await AuthService.verifyTempToken(token, uid, 'VERIFY');

    if (!hashedToken) throw new CustomError(401, 'Invalid email verification token.');

    await UserService.update(uid, {
      verified: true,
    });

    res.json({
      data: user,
      message: 'User email verified successfully.',
    });
  }
);

export default {
  signup,
  login,
  refreshAccessToken,
  logout,
  requestPasswordReset,
  resetPassword,
  requestEmailVerification,
  verifyEmail,
};