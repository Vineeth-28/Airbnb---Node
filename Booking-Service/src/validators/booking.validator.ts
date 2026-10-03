import { z } from 'zod';

export const bookingSchema = z.object({
  userId: z.string().min(1, { message: 'User Id is required' }),
  hotelId: z.string().min(1, { message: 'Hotel Id is required' }),
  bookingAmount: z
    .number()
    .int()
    .gt(200, { message: 'Booking amount must be greater than 200' })
    .max(2_147_483_647, { message: 'Booking amount is too large' }),
});
