import { Router } from 'express';

import categoryController from '../controllers/category.controller';

const categoryRouter = Router({ mergeParams: true });

categoryRouter.get('/', categoryController.getCategories);

categoryRouter.post('/', categoryController.createCategory);

categoryRouter.get('/:categoryId', categoryController.getCategory);

categoryRouter.put('/:categoryId', categoryController.updateCategory);

categoryRouter.delete('/:categoryId', categoryController.deleteCategory);

export default categoryRouter;