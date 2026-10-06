import { Job, Worker } from 'bullmq';
import { NotificationDTO } from '../dtos/notification.dto';
import { MAILER_QUEUE } from '../queues/mailer-queue';
import { getRedisClient } from '../config/redis.config';
import { MAILER_PAYLOAD } from '../producers/email.producer';
import logger from '../config/logger.config';
import { renderMailTemplate } from '../templates/templates.handler';
import { sendEmail } from '../service/mailer.service';

export const setupMailerWorker = () => {
  const emailProcessor = new Worker<NotificationDTO>(
    MAILER_QUEUE, // Name of the queue
    async (job: Job<NotificationDTO>) => {
      if (job.name !== MAILER_PAYLOAD) {
        throw new Error(`Invalid job name: ${job.name}`);
      }

      // 1. Extract payload safely using lower-case 'job'
      const payload = job.data;

      logger.info(`Processing email job ${job.id} to ${payload.to}`);

      try {
        // 2. Render the email template dynamically
        const emailContent = await renderMailTemplate(payload.templateId, payload.params);

        // 3. Dispatch the email via your service layer
        await sendEmail(payload.to, payload.subject, emailContent);
        
        logger.info(`Email successfully dispatched for job ${job.id}`);
      } catch (error) {
        logger.error(`Failed to execute email services for job ${job.id}:`, error);
        throw error; // Re-throw to let BullMQ trigger the 'failed' event
      }
    },
    {
      connection: getRedisClient(),
    }
  );

  // Event Listeners with enhanced logging
  emailProcessor.on('completed', (job) => {
    logger.info(`Email processing completed successfully for job ID: ${job.id}`);
  });

  emailProcessor.on('failed', (job, err) => {
    logger.error(`Email processing failed for job ID: ${job?.id}. Error: ${err.message}`);
  });
};
