export type createHotelDto = {
  name: string;
  location: string;
  address: string;
  rating?: number;
  ratingCount?: number;
};

export type updateHotelDto = {
  name: string;
  location: string;
  address: string;
  rating?: number;
  ratingCount?: number;
};
