import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

import serverOwnerService from '../services/serverOwner.service';

const changeServerOwnership: RequestHandler[] = [
  authenticate,
  authorize.serverOwner,
  tryCatch(
    async (req, res) => {
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