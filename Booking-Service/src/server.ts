import { serverConfig } from './config/index';
import express, { Application, Request, Response } from 'express';
import v1Router from './routes/v1/index.router';
import v2Router from './routes/v2';
import { genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationMiddleware } from './middlewares/correlation.middleware';

const app: Application = express();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.use(express.json());
app.use(express.text());
app.use(attachCorrelationMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
});
