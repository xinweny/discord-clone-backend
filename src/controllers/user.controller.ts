import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import upload from '../middleware/upload';
import validateFields from '../middleware/validateFields';

import { IUser } from '../models/User.model';
import userService from '../services/user.service';
import relationService from '../services/relation.service';

const getUser: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const selfId = req.user?._id;
      const { userId } = req.params;

      const self = selfId.equals(userId);
      
      if (self) {
        const user = await userService.getById(userId, '+email +relations');

          res.json({ data: { user } });
      } else {
        const user: Partial<IUser> = await userService.getById(
          userId, '+relations'
        );
  
        const relation = user.relationTo!(selfId);
        user.relations = undefined;
  
        res.json({
          data: {
            user,
            relation: relation || null,
          }
        });
      }
    }
  )
];

const updateUser: RequestHandler[] = [
  upload.avatar,
  ...validateFields(['username', 'displayName', 'bio', 'bannerColor', 'customStatus']),
  authenticate,
  authorize.user,
  tryCatch(
    async (req, res) => {
      const user = await userService.update(req.user?._id, { ...req.body }, req.file);

      res.json({
        data: user,
        message: 'User successfully updated.',
      });
    }
  )
];

const getMutualFriends: RequestHandler[] = [
  authenticate,
  authorize.user,
  tryCatch(
    async (req, res) => {
      const userId1 = req.params.userId;
      const { userId2 } = req.params;

      const mutualFriends = await relationService.getMutualFriends(userId1, userId2);

      res.json({ data: mutualFriends });
    }
  )
];

export default {
  getUser,
  getMutualFriends,
  updateUser,
};