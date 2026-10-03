import { Response, Request, NextFunction } from 'express';
import {
  createHotelService,
  getHotelByIdService,
  updateHotelService,
  getAllHotelsService,
  softDeleteHotelService,
  getAllHotelsWithDeletedService
} from '../services/hotel.service';
import { StatusCodes } from 'http-status-codes';

export async function createHotelHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const hotelResponse = await createHotelService(req.body);
    res.status(StatusCodes.CREATED).json({
      message: 'Hotel Created successfully',
      success: true,
      data: hotelResponse,
    });
  } catch (error) {
    next(error);
  }
}

export async function getHotelByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const hotelId = Number(req.params.id);
    if (isNaN(hotelId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid hotel ID format. ID must be a valid number.',
      });
    }

    const hotelResponse = await getHotelByIdService(hotelId);
    res.status(StatusCodes.OK).json({
      message: 'Hotel fetched successfully',
      success: true,
      data: hotelResponse,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateHotelHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const hotelId = Number(req.params.id);
    if (isNaN(hotelId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid hotel ID format. ID must be a valid number.',
      });
    }

    const hotelResponse = await updateHotelService(hotelId, req.body);
    res.status(StatusCodes.OK).json({
      message: 'Hotel updated successfully',
      success: true,
      data: hotelResponse,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllHotelsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const hotelsResponse = await getAllHotelsService();
    res.status(StatusCodes.OK).json({
      message: 'All hotels fetched successfully',
      success: true,
      data: hotelsResponse,
    });
  } catch (error) {
    next(error);
  }
}

export async function softDeleteHotelHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const hotelId = Number(req.params.id);
    if (isNaN(hotelId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid hotel ID format. ID must be a valid number.',
      });
    }

    const hotelResponse = await softDeleteHotelService(hotelId);
    res.status(StatusCodes.OK).json({
      message: 'Hotel soft deleted successfully',
      success: true,
      data: hotelResponse,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllHotelsWithDeletedHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const hotels = await getAllHotelsWithDeletedService();
    res.status(StatusCodes.OK).json({
      message: 'All hotels (including deleted) fetched successfully',
      success: true,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
}
