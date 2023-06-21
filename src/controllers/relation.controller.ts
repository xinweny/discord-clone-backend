import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';
import CustomError from '../helpers/CustomError';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

import relationService from '../services/relation.service';

const getRelations: RequestHandler[] = [
  authenticate,
  authorize.user,
  tryCatch(
    async (req, res) => {
      const userId = req.user?._id;
      const { status } = req.query;

      const relations = (status === '0' || status === '1' || status === '2')
        ? await relationService.getRelations(userId, +status as 0 | 1 | 2)
        : await relationService.getRelations(userId);

      res.json({ data: relations });
    }
  )
];

const createRelation: RequestHandler[] = [
  authenticate,
  authorize.user,
  tryCatch(
    async (req, res) => {
      const senderId = req.user?._id;
      const { status, userId } = req.body;

      const relation = (status === 0)
        ? await relationService.sendFriendRequest(senderId, userId)
        : await relationService.blockUser(senderId, userId);

      res.json({
        data: relation,
        message: `User successfully ${(status === 0) ? 'friend requested' : 'blocked'}.`,
      });
    }
  )
];

const updateRelation: RequestHandler[] = [
  authenticate,
  authorize.user,
  tryCatch(
    async (req, res) => {
      const senderId = req.user?._id;
      const { relationId } = req.params;
      const { status, userId } = req.body;

      if (status !== 1 || status !== 2) throw new CustomError(400, 'Invalid status');

      const relation = (status === 1)
        ? await relationService.acceptFriendRequest(senderId, relationId)
        : await relationService.blockUser(senderId, userId);

      res.json({
        data: relation,
        message: `User successfully ${(status === 1) ? 'friended' : 'blocked'}.`,
      });
    }
  )
];

const deleteRelation: RequestHandler[] = [
  authenticate,
  authorize.user,
  tryCatch(
    async (req, res) => {
      const { relationId } = req.params;

      const relation = await relationService.remove(req.user?._id, relationId);

      res.json({
        data: relation,
        message: 'Relation successfully removed.',
      });
    }
  )
];

export default {
  getRelations,
  createRelation,
  updateRelation,
  deleteRelation,
};