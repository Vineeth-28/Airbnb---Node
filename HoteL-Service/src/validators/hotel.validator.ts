import { z } from 'zod';

export const hotelSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(1),
  location: z.string().min(1),
  rating: z.number().min(1).optional(),
  ratingCount: z.number().min(0).optional(),
});

export const updateHotelSchema = hotelSchema.partial();
