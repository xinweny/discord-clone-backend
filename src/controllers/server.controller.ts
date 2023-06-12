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

const updateServer: RequestHandler[] = [
  authenticate,
  ...validateFields(['serverName']),
  tryCatch(
    async (req, res, next) => {
      const { serverId } = req.params;

      const authorized = await serverService.checkPermissions(serverId, req.user!._id, ['manageServer']);

      if (!authorized) throw new CustomError(401, 'Unauthorized');

      const updatedServer = await serverService.update(serverId, {
        name: req.body.serverName,
        private: !!req.body.private,
      });

      res.json({
        data: updatedServer,
        message: 'Server updated successfully.',
      });
    }
  )
];

const deleteServer: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res, next) => {
      const { serverId } = req.params;

      const authorized = await serverService.checkPermissions(serverId, req.user!._id);

      if (!authorized) throw new CustomError(401, 'Unauthorized');

      await serverService.remove(serverId);

      res.json({
        message: 'Server deleted successfully.',
      });
    }
  )
]

export default {
  createServer,
  updateServer,
  deleteServer,
};