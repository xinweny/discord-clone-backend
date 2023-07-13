import { IReqUser } from '../models/User.model';
import { IServer } from '../models/Server.model';
import { IServerMember } from '../models/ServerMember.model';
import { IDM } from '../models/DM.model';
import { IReaction } from '../models/Reaction.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IReqUser,
    avatar?: Express.Multer.File,
    banner?: Express.Multer.File,
    emoji?: Express.Multer.File,
    attachments?: Express.Multer.File[],
    server?: IServer,
    member?: IServerMember,
    dm?: IDM,
    reaction?: IReaction,
  }
}

export default Request;