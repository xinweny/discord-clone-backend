import { RequestHandler } from 'express';
import { body } from 'express-validator';

const refreshValidation: RequestHandler[] = [
  body('refreshToken')
    .isLength({ min: 1 }).withMessage('Refresh token is required.'),
];

export default refreshValidation;