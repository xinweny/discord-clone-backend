import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';
import validateFields from '../middleware/validateFields';

import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';

const createServer: RequestHandler[] = [
  authenticate,
  ...validateFields(['name']),
  tryCatch(
    async (req, res, next) => {
      console.log('hi');
    }
  )
];

export default {
  createServer
};