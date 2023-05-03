import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import env from './src/config/env.config';

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(cors({ origin: [ env.HOST ] }));
app.use(helmet());

// ROUTES

// ERROR HANDLING

app.listen(env.PORT, () => console.log(`Server started on port ${env.PORT}`));