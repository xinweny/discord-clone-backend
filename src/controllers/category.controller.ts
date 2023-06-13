import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import validateFields from '../middleware/validateFields';
import tryCatch from '../middleware/tryCatch';

import CustomError from '../helpers/CustomError';

import serverService from '../services/server.service';
import categoryService from '../services/category.service';

const createCategory: RequestHandler[] = [
  authenticate,
  ...validateFields(['categoryName']),
  tryCatch(
    async (req, res) => {
      const { serverId } = req.params;

      const authorized = await serverService.checkPermissions(serverId, req.user!._id, ['manageChannels']);

      if (!authorized) throw new CustomError(401, 'Unauthorized');

      const category = await categoryService.create(serverId, req.body.name);

      res.json({
        data: category,
        message: 'Category created successfully.',
      });
    }
  )
];

const updateCategory: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { serverId, categoryId } = req.params;

      const authorized = await serverService.checkPermissions(serverId, req.user!._id, ['manageChannels']);

      if (!authorized) throw new CustomError(401, 'Unauthorized');

      const category = await categoryService.update(serverId, categoryId, req.body.name);

      res.json({
        data: category,
        message: 'Category updated successfully',
      });
    }
  )
]

const deleteCategory: RequestHandler[] = [
  authenticate,
  tryCatch(
    async (req, res) => {
      const { serverId, categoryId } = req.params;

      const authorized = await serverService.checkPermissions(serverId, req.user!._id, ['manageChannels']);

      if (!authorized) throw new CustomError(401, 'Unauthorized');

      const category = await categoryService.remove(serverId, categoryId);

      res.json({
        data: category,
        message: 'Category deleted successfully.',
      });
    }
  )
];

export default {
  createCategory,
  updateCategory,
  deleteCategory,
};