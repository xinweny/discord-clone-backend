import jwt, { JwtPayload } from 'jsonwebtoken';

import env from '../config/env.config';
import tryCatch from './tryCatch';
import CustomError from '../helpers/CustomError';
import UserService from '../services/user.service';

const authenticate = tryCatch(
  async (req, res, next) => {
    if (!req.headers.authorization) throw new CustomError(401, 'Unauthorized');

    const accessToken = req.headers.authorization.split(' ')[1];

    const payload = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as JwtPayload;

    const user = await UserService.getById(payload._id, true);

    if (!user) throw new CustomError(400, 'User not found.');
    if (!user.verified) throw new CustomError(401, 'Unverified user', { user });

    req.user = user;

    next();
  }
)

export default authenticate;