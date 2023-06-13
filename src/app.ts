import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import env from './config/env.config';
import apiRateLimiter from './config/rateLimit.config';
import './config/db.config';

import router from './routers/index.router';
import CustomError from './helpers/CustomError';
import errorHandler from './middleware/errorHandler';
import { IReqUser } from './models/User.model';

const app = express();

declare module 'express-serve-static-core' {
  interface Request {
    user?: IReqUser,
  }
}

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors({ origin: [ env.HOST ] }));
app.use(apiRateLimiter);

// ROUTES
app.use('/api/v1', router);

// ERROR HANDLING
app.use('*', (req, res) => { throw new CustomError(404, 'Resource not found.'); });
app.use(errorHandler);

export default app; 