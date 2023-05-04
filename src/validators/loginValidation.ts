import { RequestHandler } from 'express';
import { body } from 'express-validator';

const loginValidation: RequestHandler[] = [
  body('email')
    .isLength({ min: 1 }).withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 1 }).withMessage('Password is required.')
];

export default loginValidation;