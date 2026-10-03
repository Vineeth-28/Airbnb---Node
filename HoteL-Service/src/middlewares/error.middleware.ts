import { ErrorRequestHandler } from 'express';

export const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  // Keep variables explicitly referenced so the compiler keeps all 4 arguments
  const _req = req;
  const _next = next;

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
