import { RequestHandler } from 'express';
import { body } from 'express-validator';

const VALIDATION_RULES: { [key: string]: RequestHandler } = {
  email: body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body: body('body')
    .trim().notEmpty().withMessage('Message body cannot be empty.')
    .escape(),
  username: body('username')
    .escape().trim().isLength({ min: 2, max: 32 }).withMessage('Username must be between 2 and 32 characters long.')
    .matches(/^(?!.*__)[a-z0-9._]+$/).withMessage('Username can only contain lowercase alphanumeric characters, underscores (_) and/or non-consecutive periods (.).'),
  password: body('password')
    .isLength({ min: 1 }).withMessage('Password is required.'),
  confirmPassword: body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match.'),
  refreshToken: body('refreshToken')
    .escape()
    .notEmpty().withMessage('Refresh token is required.'),
  serverName: body('name')
    .escape().trim().isLength({ min: 2, max: 32 }).withMessage('Server name must be between 2 and 32 characters long.'),
  channelName: body('name')
    .escape().trim()
    .isLength({ min: 2, max: 32 }).withMessage('Channel name must be between 2 and 32 characters long.'),
  categoryName: body('name')
    .escape().trim()
    .isLength({ min: 2, max: 32 }).withMessage('Category name must be between 2 and 32 characters long.'),
  displayName: body('displayName')
    .escape().trim()
    .isLength({ min: 2, max: 32 }).withMessage('Display name must be between 2 and 32 characters long.'),
  bio: body('bio')
    .escape().trim()
    .isLength({ min: 1, max: 190 }).withMessage('Bio must be between 1 and 190 characters long.'),
  bannerColor: body('bannerColor')
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Invalid HEX code.'),
  emojiName: body('name')
    .escape().trim()
    .matches(/^[a-z0-9_]+$/).withMessage('Emoji name can only contain alphanumeric characters and underscores.')
    .isLength({ min: 2, max: 32 }).withMessage('Emoji name must be between 2 and 32 characters long.'),
};

export default VALIDATION_RULES;