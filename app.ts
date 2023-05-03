import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import env from './src/config/env.config';
import apiRateLimiter from './src/config/rateLimit.config';

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(cors({ origin: [ env.HOST ] }));
app.use(helmet());
app.use(apiRateLimiter);

// ROUTES

// ERROR HANDLING

app.listen(env.PORT, () => console.log(`Server started on port ${env.PORT}`));4