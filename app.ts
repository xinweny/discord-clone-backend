import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(cors({ origin: [] }));
app.use(helmet());

// ROUTES

// ERROR HANDLING

app.listen();