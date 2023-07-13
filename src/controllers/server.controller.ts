import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validateFields from '../middleware/validateFields';
import upload from '../middleware/upload';

import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';

const getPublicServers: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const query = req.query.query?.toString();

      if (!query) throw new CustomError(400, 'Query string required.');

      const page = req.query.page ? +req.query.page : 1;
      const limit = req.query.limit ? +req.query.limit : 10;

      const { servers, count } = await serverService.getPublic(query, { page, limit });

      res.json({
        data: {
          items: servers,
          totalDocs: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
        }
      });
    }
  )
]

const getServer: RequestHandler[] = [
  authenticate,
  authorize.serverMember,
  tryCatch(
    async (req, res) => {
      const server = await serverService.getById(req.params.serverId);

      res.json({ data: server });
    }
  )
];

const createServer: RequestHandler[] = [
  upload.avatar,
  ...validateFields(['serverName']),
  authenticate,
  tryCatch(
    async (req, res) => {
      const data = await serverService.create({ ...req.body }, req.user?._id, req.avatar);

      if (!data) throw new CustomError(400, 'Bad request');

      res.json({
        data: data,
        message: 'Server created successfully.',
      });
    }
  )
];

const updateServer: RequestHandler[] = [
  upload.serverImages,
  ...validateFields(['serverName', 'description']),
  authenticate,
  authorize.server('manageServer'),
  tryCatch(
    async (req, res) => {
      const updatedServer = await serverService.update(req.server?._id, { ...req.body }, {
        avatar: req.avatar,
        banner: req.banner,
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
  authorize.server(),
  tryCatch(
    async (req, res) => {
      const { serverId } = req.params;

      await serverService.remove(serverId);

      res.json({
        message: 'Server deleted successfully.',
      });
    }
  )
];

export default {
  getPublicServers,
  getServer,
  createServer,
  updateServer,
  deleteServer,
};