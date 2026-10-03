import { createHotelDto, updateHotelDto } from '../dto/hotel.dto';
import logger from '../config/logger.config';
import { NotFoundError } from '../utils/errors/app.error';
import Hotel from '../db/models/Hotel';

export async function createHotel(hoteldata: createHotelDto): Promise<Hotel> {
  const hotel = await Hotel.create({
    name: hoteldata.name,
    location: hoteldata.location,
    address: hoteldata.address,
    rating: hoteldata.rating ?? null, // FIX: Convert undefined to null
    ratingCount: hoteldata.ratingCount ?? null, // FIX: Convert undefined to null
  });

  logger.info(`Hotel Created ${hotel.id}`);
  return hotel;
}

export async function getHotelById(id: number): Promise<Hotel> {
  const hotel = await Hotel.findByPk(id);

  if (!hotel) {
    logger.info(`Hotel Not Found ${id}`);
    throw new NotFoundError(`Hotel with id ${id} not found`);
  }

  logger.info(`Hotel found ${hotel.id}`);
  return hotel;
}

export async function getAllHotels(): Promise<Hotel[]> {
  const hotels = await Hotel.findAll();
  logger.info(`All Hotels Retrieved`);
  return hotels;
}

export async function updateHotel(id: number, updateData: updateHotelDto): Promise<Hotel> {
  const hotel = await getHotelById(id);
  await hotel.update({
    name: updateData.name,
    location: updateData.location,
    address: updateData.address,
    rating: updateData.rating ?? null, // FIX: Convert undefined to null
    ratingCount: updateData.ratingCount ?? null, // FIX: Convert undefined to null
  });

  logger.info(`Hotel Updated ${id}`);
  return hotel;
}

export async function softDeleteHotel(id: number): Promise<void> {
  const hotel = await getHotelById(id);

  // Explicitly set the deletion timestamp so this API can never issue a
  // hard DELETE statement.
  await hotel.update({ deletedAt: new Date() });
  logger.info(`Hotel soft deleted ${id}`);
}

export async function getAllHotelsWithDeleted(): Promise<Hotel[]> {
  const hotels = await Hotel.findAll({ paranoid: false });

  logger.info(`All Hotels (including deleted) Retrieved`);
  return hotels;
}
