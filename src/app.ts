import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import './utils/reqInterface';

import env from './config/env.config';
import apiRateLimiter from './config/rateLimit.config';
import './config/db.config';

import errorHandler from './middleware/errorHandler';

import router from './routers/index.router';

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(apiRateLimiter);

// ROUTES
app.use('/api/v1', router);

// ERROR HANDLING
app.use('*', (req, res) => res.status(404).json({ message: 'Resource not found.' }));
app.use(errorHandler);

export default app; 