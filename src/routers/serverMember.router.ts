import { Router } from 'express';

import serverMemberController from '../controllers/serverMember.controller';

const serverMemberRouter = Router({ mergeParams: true });

serverMemberRouter.post('/', serverMemberController.joinServer);

serverMemberRouter.put('/:memberId', serverMemberController.editServerProfile);

serverMemberRouter.delete('/:memberId', serverMemberController.leaveServer);

export default serverMemberRouter;