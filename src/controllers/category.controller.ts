import { RequestHandler } from 'express';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validateFields from '../middleware/validateFields';
import tryCatch from '../middleware/tryCatch';

import categoryService from '../services/category.service';

const createCategory: RequestHandler[] = [
  ...validateFields(['categoryName']),
  authenticate,
  authorize.server('manageChannels'),
  tryCatch(
    async (req, res) => {
      const { serverId } = req.params;

      const category = await categoryService.create(serverId, req.body.name);

      res.json({
        data: category,
        message: 'Category created successfully.',
      });
    }
  )
];

const updateCategory: RequestHandler[] = [
  ...validateFields(['categoryName']),
  authenticate,
  authorize.server('manageChannels'),
  tryCatch(
    async (req, res) => {
      const { serverId, categoryId } = req.params;

      const category = await categoryService.update(serverId, categoryId, req.body.name);

      res.json({
        data: category,
        message: 'Category updated successfully',
      });
    }
  )
];

const deleteCategory: RequestHandler[] = [
  authenticate,
  authorize.server('manageChannels'),
  tryCatch(
    async (req, res) => {
      const { serverId, categoryId } = req.params;

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