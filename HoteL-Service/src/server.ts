import { serverConfig } from './config/index';
import express, { Application, Request, Response } from 'express';
import v1Router from './routes/v1/index.router';
import v2Router from './routes/v2';
import { genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationMiddleware } from './middlewares/correlation.middleware';
import { sequelize } from './db/models/sequelize';
import Hotel from './db/models/Hotel';

const app: Application = express();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.use(express.json());
app.use(express.text());
app.use(attachCorrelationMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // // const hotel = await Hotel.create({
    // //    name: 'Hotel Newyork',
    // //    address: '123 Saint St',
    // //    location: 'Las Vegas',
    // //    rating: 4.2,
    // //    ratingCount: 4
    // // });
    // const hotel = await Hotel.findAll();
    // logger.info('Hotels retrieved successfully: ', hotel);
  } catch (error) {
    logger.error('Unable to connect to the database.', error);
  }
});
