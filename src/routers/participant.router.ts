import { Router } from 'express';

import participantController from '../controllers/participant.controller';

const participantRouter = Router({ mergeParams: true });

participantRouter.post('/', participantController.addParticipants);

participantRouter.delete('/:participantId', participantController.removeParticipant);

export default participantRouter;