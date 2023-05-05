import { RequestHandler } from 'express';
import { body } from 'express-validator';

const signupValidation: RequestHandler[] = [
  body('email')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('username')
    .trim().isLength({ min: 2, max: 32 }).withMessage('Username must be between 2 and 32 characters long.')
    .matches(/^[^@#:`]+$/).withMessage('Username must not contain the following characters: @, #, :, `')
    .escape(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match.'),
];

export default signupValidation;