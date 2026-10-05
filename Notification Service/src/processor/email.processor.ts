import { Job, Worker } from 'bullmq';
import { NotificationDTO } from '../dtos/notification.dto';
import { MAILER_QUEUE } from '../queues/mailer-queue';
import { getRedisClient } from '../config/redis.config';
import { MAILER_PAYLOAD } from '../producers/email.producer';

import logger from '../config/logger.config';

export const setupMailerWorker = () => {
  const emailProcessor = new Worker<NotificationDTO>(
    MAILER_QUEUE, // Name of the queue
    async (job: Job) => {
      if (job.name !== MAILER_PAYLOAD) {
        throw new Error('Invalid job name');
      }

      // call the service layer from here.
    }, // Process function
    {
      connection: getRedisClient(),
    },
  );

  emailProcessor.on('failed', () => {
    console.error('Email processing failed');
  });

  emailProcessor.on('completed', () => {
    console.log('Email processing completed successfully');
  });
};
