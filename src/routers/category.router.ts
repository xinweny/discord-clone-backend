import { Router } from 'express';

import categoryController from '../controllers/category.controller';

const categoryRouter = Router({ mergeParams: true });

categoryRouter.post('/', categoryController.createCategory);

categoryRouter.put('/:categoryId', categoryController.updateCategory);

categoryRouter.delete('/:categoryId', categoryController.deleteCategory);

export default categoryRouter;