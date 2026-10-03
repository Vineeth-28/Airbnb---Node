import winston from 'winston';
import 'winston-mongodb'; // Required to register winston.transports.MongoDB
import { getCorrelationId } from '../utils/helpers/request.helpers';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp, ...data }) => {
      const output = {
        level,
        message,
        timestamp,
        correlationId: getCorrelationId(),
        data,
      };
      return JSON.stringify(output);
    }),
  ),
  transports: [
    new winston.transports.Console(),

    new DailyRotateFile({
      filename: 'logs/%DATE%-app.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),

    // Added MongoDB transport directly inside the transports array
    new winston.transports.MongoDB({
      level: 'info',
      db: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase', // Fallback to local MongoDB if env variable is not set
      options: {
        //useUnifiedTopology: true,
      },
      collection: 'logs',
      // Automatically treats collection as capped (auto-clears old logs)
      capped: true,
      cappedSize: 52428800, // 50MB in bytes (adjust as needed)
      // Stores correlationId and other metadata under a clean structure
      metaKey: 'meta',
    }),
  ],
});

export default logger;
