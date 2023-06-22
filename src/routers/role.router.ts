import { Router } from 'express';

import roleController from '../controllers/role.controller';

const roleRouter = Router({ mergeParams: true });

roleRouter.get('/', roleController.getRoles);

roleRouter.post('/', roleController.createRole);

roleRouter.get('/:roleId', roleController.getRole);

roleRouter.put('/:roleId', roleController.updateRole);

roleRouter.delete('/:roleId', roleController.deleteRole);

export default roleRouter;