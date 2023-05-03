import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import env from './config/env.config';
import apiRateLimiter from './config/rateLimit.config';
import './config/db.config';

import router from './routes/index.route';

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(helmet());
app.use(cors({ origin: [ env.HOST ] }));
app.use(apiRateLimiter);

// ROUTES
app.use('/api/v1', router);

// ERROR HANDLING

export default app;