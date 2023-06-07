import { RequestHandler } from 'express';

import tryCatch from '../middleware/tryCatch';
import authenticate from '../middleware/authenticate';
import validateFields from '../middleware/validateFields';

import serverService from '../services/server.service';

const createServer: RequestHandler[] = [
  authenticate,
  ...validateFields(['serverName']),
  tryCatch(
    async (req, res, next) => {
      const server = await serverService.create({
        creatorId: req.user!._id,
        ...req.body,
      });

      res.json({
        data: server,
        message: 'Server created successfully.',
      });
    }
  )
];

export default {
  createServer,
};