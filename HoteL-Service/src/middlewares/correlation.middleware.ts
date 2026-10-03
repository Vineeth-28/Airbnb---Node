import { NextFunction, Request, Response } from 'express';
import { asyncLocalStorage } from '../utils/helpers/request.helpers';

export const attachCorrelationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Use eval to prevent ts-node/CommonJS from converting this into a failing require() call
  const { v4: uuidV4 } = await eval(`import('uuid')`);

  // Generate a unique Correlation id
  const correlationId = uuidV4();
  req.headers['x-correlation-id'] = correlationId;

  // Call the middleware execution context
  asyncLocalStorage.run(
    {
      correlationId: correlationId,
    },
    () => {
      next();
    },
  );
};
