import { validateRequestBody } from './../../validators/index';
import { hotelSchema } from './../../validators/hotel.validator';

import express from 'express';
import {
  createHotelHandler,
  updateHotelHandler,
  softDeleteHotelHandler,
  getAllHotelsWithDeletedHandler,
  getHotelByIdHandler,
  getAllHotelsHandler,
} from '../../controllers/hotel.controller';

const HotelRouter = express.Router();

// 1. Base Collection Routes
HotelRouter.post('/', validateRequestBody(hotelSchema), createHotelHandler);
HotelRouter.get('/', getAllHotelsHandler);

// 2. Specific Static Sub-paths (MUST go before /:id)
HotelRouter.get('/all', getAllHotelsWithDeletedHandler);

// 3. Dynamic ID Parameter Routes (Evaluated last)
HotelRouter.get('/:id', getHotelByIdHandler);
HotelRouter.delete('/:id', softDeleteHotelHandler);
HotelRouter.put('/:id', validateRequestBody(hotelSchema), updateHotelHandler);

export default HotelRouter;
