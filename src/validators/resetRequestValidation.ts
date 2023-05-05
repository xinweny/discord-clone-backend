import { RequestHandler } from 'express';
import { body } from 'express-validator';

const resetRequestValidation: RequestHandler[] = [
  body('email')
    .isLength({ min: 1 }).withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
];

export default resetRequestValidation;