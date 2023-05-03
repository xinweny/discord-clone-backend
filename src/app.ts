import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import env from './config/env.config';
import apiRateLimiter from './config/rateLimit.config';

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(cors({ origin: [ env.HOST ] }));
app.use(helmet());
app.use(apiRateLimiter);

// ROUTES

// ERROR HANDLING

export default app;