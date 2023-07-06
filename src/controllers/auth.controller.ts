import { RequestHandler } from 'express';

import env from '../config/env.config';

import tryCatch from '../helpers/tryCatch';
import CustomError from '../helpers/CustomError';

import validateFields from '../middleware/validateFields';

import passwordResetMail from '../templates/passwordResetMail';
import emailVerificationMail from '../templates/emailVerificationMail';

import userService from '../services/user.service';
import mailService from '../services/mail.service';
import authService from '../services/auth.service';

const signup: RequestHandler[] = [
  ...validateFields(['email', 'username', 'password', 'confirmPassword']),
  tryCatch(
    async (req, res) => {
      const { email, username, password } = req.body;

      const existingUser = await userService.getOne({ email });

      if (existingUser) throw new CustomError(400, 'Email already in use. Please choose a different email.');

      const hashedPassword = await authService.hashPassword(password);

      const newUser = await userService.create({
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
  tryCatch(
    async (req, res) => {
      const { email, password } = req.body;

      const user = await userService.getOne({ email }, true);
      if (!user) throw new CustomError(401, 'Invalid email or password.');

      const verifiedPassword = await authService.verifyPassword(password, user.password);
      if (!verifiedPassword) throw new CustomError(401, 'Invalid email or password.');

      const { accessToken, refreshToken } = await authService.generateTokens(user);

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

      res.json({
        data: {
          userId: user._id,
          accessToken,
        },
        message: 'Logged in successfully.',
      });
    }
  )
];

const refreshAccessToken: RequestHandler[] = [
  tryCatch(
    async (req, res) => {
      const decodedToken = await authService.verifyRefreshToken(req.cookies.jwt);

      if (!decodedToken) throw new CustomError(401, 'Invalid refresh token.');

      const { _id } = decodedToken;

      const user = { _id };

      const accessToken = authService.issueAccessToken(user);

      res.json({
        data: accessToken,
        message: 'Access token issued successfully.',
      });
    }
  )
];

const logout: RequestHandler[] = [
  tryCatch(
    async (req, res) => {
      await authService.deleteRefreshToken(req.cookies.jwt);

      res.json({
        data: {},
        message: 'Logged out successfully.',
      });
    }
  )
];

const requestPasswordReset: RequestHandler[] = [
  ...validateFields(['email']),
  tryCatch(
    async (req, res) => {
      const { email } = req.body;

      const user = await userService.getOne({ email });

      if (!user) throw new CustomError(400, 'User does not exist.');

      const id = user._id.toString();
      const resetToken = await authService.issueTempToken(id, 'RESET', 1800000);
      const clientURL = `${env.HOST}:${env.PORT}`;

      const link = `${clientURL}/api/v1/reset?token=${resetToken}&uid=${id}`;

      const mail = await mailService.sendMail(
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
  tryCatch(
    async (req, res) => {
      if (!req.query.token || !req.query.uid) throw new CustomError(404, 'Not found.');

      const token = req.query.token.toString();
      const uid = req.query.uid.toString();

      const isValid = await authService.verifyTempToken(token, uid, 'RESET');
      if (!isValid) throw new CustomError(400, 'Invalid reset token');

      const hashedPassword = await authService.hashPassword(req.body.password);

      const user = await userService.updateSensitive(uid, { password: hashedPassword });

      if (!user) throw new CustomError(400, 'Bad request');

      res.json({
        data: user,
        message: 'Password changed successfully.',
      });
    }
  )
];

const requestEmailVerification: RequestHandler[] = [
  ...validateFields(['email']),
  tryCatch(
    async (req, res) => {
      const { email } = req.body;

      const user = await userService.getOne({ email });

      if (!user) throw new CustomError(400, 'User does not exist.');

      const id = user._id.toString();
      const verifyToken = await authService.issueTempToken(id, 'VERIFY', 1800000);
      const clientURL = `${env.HOST}:${env.PORT}`;

      const link = `${clientURL}/api/v1/verify?token=${verifyToken}&uid=${id}`;

      const mail = await mailService.sendMail(
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
  async (req, res) => {
    if (!req.query.token || !req.query.uid) throw new CustomError(404, 'Not found.');

    const token = req.query.token.toString();
    const uid = req.query.uid.toString();

    const user = await userService.getOne({ _id: uid });

    if (!user) throw new CustomError(400, 'User does not exist.');
    if (user.verified) throw new CustomError(400, 'User email has already been verified.');

    const isValid = await authService.verifyTempToken(token, uid, 'VERIFY');
    if (!isValid) throw new CustomError(400, 'Invalid verify token');

    await userService.updateSensitive(uid, { verified: true });

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