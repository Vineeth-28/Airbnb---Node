import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createBookingService, confirmBookingsService } from '../services/booking.service';

export const bookingHandler = async (req: Request, res: Response, next: NextFunction) => {
  const booking = await createBookingService(req.body);
  res.status(StatusCodes.CREATED).json({
    bookingid: booking.bookingId,
    idempotencyKey: booking.idempotencyKey,
  });
};

export const confirmBookingHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'A valid idempotency key is required',
    });
  }

  const booking = await confirmBookingsService(id);

  res.status(StatusCodes.CREATED).json({
    bookingId: booking.id,
    status: booking.status,
  });
};
