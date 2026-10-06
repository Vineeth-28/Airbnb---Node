import { serverConfig } from '../config';
import { InternalServerError } from '../utils/errors/app.error';
import { transporter } from '../config/nodemailer.config';
import logger from '../config/logger.config';
export async function sendEmail(to: string, subject: string, body: string) {
  try {
    await transporter.sendMail({
      from: serverConfig.MAIL_USER,
      to,
      subject,
      html: body,
    });
    logger.info(`Email sent to ${to} with Subject ${subject}"`)
  } catch (error) {
    throw new InternalServerError(`Failed to send Message`);
  }
}
