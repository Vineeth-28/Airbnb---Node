import { IdempotencyKey, Prisma, booking } from '../../generated/prisma';
import prisma from '../prisma/prismaClient';
import { BadRequestError } from '../utils/errors/app.error';
import { validate as isValidateUUID } from 'uuid';

export async function createBooking(
  tx: Prisma.TransactionClient,
  bookingData: Prisma.bookingCreateInput,
): Promise<booking> {
  const newBooking = await tx.booking.create({
    data: bookingData,
  });

  return newBooking;
}
export async function createIdempotencyKey(
  tx: Prisma.TransactionClient,
  key: string,
  bookingId: number,
) {
  const idempotencyKey = await tx.idempotencyKey.create({
    data: {
      id: key,
      key,
      Booking: { connect: { id: bookingId } },
    },
  });

  return idempotencyKey;
}

export async function getIdempotencyKeyWithLock(tx: Prisma.TransactionClient, key: string) {
  if (!isValidateUUID(key)) {
    throw new BadRequestError('Invalid UUID format for idempotency key');
  }
  const idempotencyKey = await tx.$queryRaw<
    IdempotencyKey[]
  >`SELECT * FROM \`idempotencykey\` WHERE \`key\` = ${key} FOR UPDATE`;
  return idempotencyKey[0] || null;
}
export async function getBookingById(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  return booking;
}

export async function confirmBooking(tx: Prisma.TransactionClient, bookingId: number) {
  const booking = await tx.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: 'CONFIRMED',
    },
  });
  return booking;
}

export async function cancelBooking(bookingId: number) {
  const booking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: 'CANCELLED',
    },
  });
  return booking;
}

export async function finalizeIdempotencyKey(tx: Prisma.TransactionClient, key: string) {
  const idempotencyKey = await tx.idempotencyKey.update({
    where: {
      key,
    },
    data: {
      finalized: true,
    },
  });
  return idempotencyKey;
}
