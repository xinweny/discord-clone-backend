import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import tryCatch from './tryCatch';
import CustomError from '../utils/CustomError';

const checkValidation: RequestHandler = tryCatch(
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new CustomError(
        'Validation failed.',
        400,
        errors.array()
      );
    }

    next();
  }
);

export default checkValidation;