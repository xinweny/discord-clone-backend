import { RequestHandler } from 'express';
import { body } from 'express-validator';

const VALIDATION_FIELDS: { [key: string]: RequestHandler } = {
  email: body('email')
    .isLength({ min: 1 }).withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body: body('body')
    .trim().isLength({ min: 1 }).withMessage('Message body cannot be empty.')
    .escape(),
  username: body('username')
    .trim().isLength({ min: 2, max: 32 }).withMessage('Username must be between 2 and 32 characters long.')
    .matches(/^[^@#:`]+$/).withMessage('Username must not contain the following characters: @, #, :, `')
    .escape(),
  password: body('password')
    .isLength({ min: 1 }).withMessage('Password is required.'),
  confirmPassword: body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match.'),
  refreshToken: body('refreshToken')
    .isLength({ min: 1 }).withMessage('Refresh token is required.'),
  serverName: body('name')
    .trim().isLength({ min: 2, max: 32 }).withMessage('Server name must be between 2 and 32 characters long.'),
  channelName: body('name')
    .trim().isLength({ min: 2, max: 32 }).withMessage('Channel name must be between 2 and 32 characters long.'),
  categoryName: body('name')
    .trim().isLength({ min: 2, max: 32 }).withMessage('Category name must be between 2 and 32 characters long.'),
};

export default VALIDATION_FIELDS;