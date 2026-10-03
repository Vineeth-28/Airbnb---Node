import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.config';

export const pingHandler = async (req: Request, res: Response, next: NextFunction) => {
  const clientMessage = req.body.message;

  res.status(200).json({
    message: 'Pong',
    receivedData: clientMessage,
    success: true,
  });

  logger.info('Request Body', req.body);
};
