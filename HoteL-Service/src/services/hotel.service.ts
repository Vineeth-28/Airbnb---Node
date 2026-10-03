import { createHotelDto, updateHotelDto } from '../dto/hotel.dto';
import {
  createHotel,
  getHotelById,
  updateHotel,
  softDeleteHotel,
  getAllHotels,
  getAllHotelsWithDeleted,
} from '../repository/hotel.repository';

export async function createHotelService(hotelData: createHotelDto) {
  const hotel = await createHotel(hotelData);
  return hotel;
}

export async function getHotelByIdService(id: number) {
  const hotel = await getHotelById(id);
  return hotel;
}

export async function getAllHotelsService() {
  const hotels = await getAllHotels();
  return hotels;
}

export async function updateHotelService(id: number, updateData: updateHotelDto) {
  const hotel = await updateHotel(id, updateData);
  return hotel;
}

export async function softDeleteHotelService(id: number) {
  const hotel = await softDeleteHotel(id);
  return hotel;
}

export async function getAllHotelsWithDeletedService() {
  const hotels = await getAllHotelsWithDeleted();

  return hotels;
}
