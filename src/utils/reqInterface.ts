import { IReqUser } from '../models/User.model';
import { IServer } from '../models/Server.model';
import { IServerMember } from '../models/ServerMember.model';
import { IDirectMessage } from '../models/DM.model';
import { IReaction } from '../models/Reaction.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IReqUser,
    file?: Express.Multer.File,
    files?: Express.Multer.File[],
    server?: IServer,
    member?: IServerMember,
    dm?: IDirectMessage,
    reaction?: IReaction,
  }
}

export default Request;