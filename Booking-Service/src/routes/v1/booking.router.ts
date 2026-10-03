import express from 'express';
import { validateRequestBody } from './../../validators/index';

import { bookingSchema } from '../../validators/booking.validator';

import { bookingHandler, confirmBookingHandler } from '../../controllers/booking.controller';

const bookingRouter = express.Router();

bookingRouter.post('/', validateRequestBody(bookingSchema), bookingHandler);
bookingRouter.post('/confirm/:id', confirmBookingHandler);

export default bookingRouter;
