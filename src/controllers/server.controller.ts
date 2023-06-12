import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';
import validateFields from '../middleware/validateFields';

import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';

const createServer: RequestHandler[] = [
  authenticate,
  ...validateFields(['serverName']),
  tryCatch(
    async (req, res, next) => {
      const data = await serverService.create({
        name: req.body.serverName,
        private: !!req.body.private,
      }, req.user!._id);

      if (!data) throw new CustomError(400, 'Bad request');

      res.json({
        data: data,
        message: 'Server created successfully.',
      });
    }
  )
];

export default {
  createServer,
};