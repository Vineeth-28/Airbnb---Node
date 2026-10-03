import { booking } from '../../generated/prisma';
import {
  confirmBooking,
  createBooking,
  createIdempotencyKey,
  finalizeIdempotencyKey,
  getIdempotencyKeyWithLock,
} from '../repository/Booking.repository';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../utils/errors/app.error';
import { generateIdempotencyKey } from '../utils/helpers/generateIdempotencyKey';
import { CreateBookingDto } from '../dtos/booking.dto';
import prisma from '../prisma/prismaClient';
import { serverConfig } from '../config';
import { redlock } from '../config/redis.config';
import { ResourceLockedError, type Lock } from 'redlock';

export async function createBookingService(
  createBookingDto: CreateBookingDto,
): Promise<{ bookingId: number; idempotencyKey: string }> {
  const userId = Number(createBookingDto.userId);
  const hotelId = Number(createBookingDto.hotelId);
  const BookingAmount = Number(createBookingDto.bookingAmount);

  if (!Number.isSafeInteger(userId) || userId <= 0 || userId > 2_147_483_647) {
    throw new BadRequestError('User ID must be a positive integer');
  }

  if (!Number.isSafeInteger(hotelId) || hotelId <= 0 || hotelId > 2_147_483_647) {
    throw new BadRequestError('Hotel ID must be a positive integer');
  }

  if (isNaN(BookingAmount) || BookingAmount <= 0) {
    throw new BadRequestError('Booking amount must be a positive number');
  }

  let lock: Lock;
  try {
    lock = await redlock.acquire([`hotel:${hotelId}`], serverConfig.LOCK_TTL);
  } catch (error) {
    if (error instanceof ResourceLockedError) {
      throw new ConflictError('This hotel is currently being booked. Please try again later.');
    }

    throw new InternalServerError('Failed to acquire lock for booking resource');
  }

  try {
    return prisma.$transaction(async (tx) => {
      const createdBooking = await createBooking(tx, {
        userid: userId,
        hotelId,
        bookingAmount: BookingAmount,
      });
      const idempotencyKey = generateIdempotencyKey();

      await createIdempotencyKey(tx, idempotencyKey, createdBooking.id);
      return {
        bookingId: createdBooking.id,
        idempotencyKey,
      };
    });
  } catch (error) {
    try {
      await lock.release();
    } catch (releaseError) {
      console.error('Failed to release booking lock after booking creation failed', releaseError);
    }

    throw error;
  }
}

export async function confirmBookingsService(idempotencyKey: string): Promise<booking> {
  return prisma.$transaction(async (tx) => {
    const idempotencyKeyData = await getIdempotencyKeyWithLock(tx, idempotencyKey);

    if (!idempotencyKeyData) {
      throw new NotFoundError('Idempotency key not found');
    }

    if (idempotencyKeyData.finalized) {
      throw new BadRequestError('Idempotency key already finalized');
    }

    const bookingToConfirm = await tx.booking.findUnique({
      where: {
        idempotencyKeyId: idempotencyKeyData.id,
      },
    });

    if (!bookingToConfirm) {
      throw new NotFoundError('Associated booking record not found');
    }

    const confirmedBooking = await confirmBooking(tx, bookingToConfirm.id);
    await finalizeIdempotencyKey(tx, idempotencyKey);

    return confirmedBooking;
  });
}
