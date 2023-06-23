import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

import participantService from '../services/participant.service';

const addParticipants: RequestHandler[] = [
  authenticate,
  authorize.dmMember,
  tryCatch(
    async (req, res) => {
      const dm = await participantService.add(req.params.dmId, req.body.userIds);

      res.json({
        data: dm,
        message: 'Participants added successfully.',
      });
    }
  )
];

const removeParticipant: RequestHandler[] = [
  authenticate,
  authorize.dmOwnerOrParticipantSelf,
  tryCatch(
    async (req, res) => {
      const { dmId, participantId } = req.params;

      const dm = await participantService.remove(dmId, participantId);

      res.json({
        data: dm,
        message: 'Participant removed successfully.',
      });
    }
  )
];

export default {
  addParticipants,
  removeParticipant,
}