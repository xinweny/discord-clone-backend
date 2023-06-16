import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import tryCatch from '../middleware/tryCatch';

import serverOwnerService from '../services/serverOwner.service';

const changeServerOwnership: RequestHandler[] = [
  authenticate,
  authorize.serverOwner,
  tryCatch(
    async (req, res, next) => {
      const server = await serverOwnerService.update(req.params.serverId, req.user?._id);

      res.json({
        data: { server, member: req.member },
        message: 'Server ownership changed successfully.',
      });
    }
  )
];

export default {
  changeServerOwnership,
}