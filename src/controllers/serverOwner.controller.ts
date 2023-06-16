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
      const data = await serverOwnerService.update(req.params.serverId, req.body.memberId);

      res.json({
        data,
        message: 'Server ownership changed successfully.',
      });
    }
  )
];

export default {
  changeServerOwnership,
}