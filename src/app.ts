import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import type { CorsOptions } from 'cors';

import helmet from 'helmet';
import whitelist from './config/whitelist.ts';
import routes from './routes/index.ts';
import errorHandler from './core/errors/errorHandler.ts';
import { errorMiddleware } from './core/errors/errorMiddleware.ts';

import './core/extensions/bigintExtension.ts';

export const app: Express = express();

app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(express.json({ limit: '25mb'}));

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // whitelist is expected to be an array of strings.
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(routes);

// Global error handling for non-Express errors
process.on('uncaughtException', (error: Error) => {
  errorHandler.handleError(error);
});

process.on('unhandledRejection', (error: Error) => {
  errorHandler.handleError(error);
});

// Express error-handling middleware (should be last)
app.use(errorMiddleware);

export default app;
