import express, { Application } from 'express';
import v1Router from './routes/v1/index.router';
import v2Router from './routes/v2';
import { genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationMiddleware } from './middlewares/correlation.middleware';
import { serverConfig } from './config';
import { setupMailerWorker } from './processor/email.processor';
import { NotificationDTO } from './dtos/notification.dto';
import { addEmailToQueue } from './producers/email.producer';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { mailerQueue } from './queues/mailer-queue';
import { authenticateBullBoard } from './middlewares/bull-board-auth.middleware';
import { renderMailTemplate } from './templates/templates.handler';

const app: Application = express();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const bullBoardAdapter = new ExpressAdapter();
bullBoardAdapter.setBasePath('/admin/queues');
createBullBoard({
  queues: [new BullMQAdapter(mailerQueue)],
  serverAdapter: bullBoardAdapter,
});

app.use(express.json());
app.use(express.text());
app.use(attachCorrelationMiddleware);
app.get('/admin/queue', (_request, response) => {
  response.redirect(308, '/admin/queues');
});
app.use('/admin/queues', authenticateBullBoard, bullBoardAdapter.getRouter());
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
  setupMailerWorker();
  logger.info(`Mailer worker setup Completed`);
  const response = await renderMailTemplate('welcome', {
    name: 'John Doe',
    appname: 'Booking.com',
  });
  console.log(`Rendered email ,${response}`);
});
