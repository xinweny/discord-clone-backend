import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import upload from '../middleware/upload';
import validateFields from '../middleware/validateFields';

import userService from '../services/user.service';

const getUser: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const user = await userService.getById(req.params.userId);

      res.json({ data: user });
    }
  )
];

const updateUser: RequestHandler[] = [
  upload.avatar,
  ...validateFields(['username', 'displayName', 'bio', 'bannerColor']),
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

export default {
  getUser,
  updateUser,
};