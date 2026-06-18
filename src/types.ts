export interface Room {
  id: string;
  lodgeId: string;
  roomNumber: string;
  name: string;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Penthouse' | 'Family';
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  image: string;
  isBooked: boolean;
  description: string;
}

export interface Lodge {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  featuredAmenity: string;
  basePrice: number;
}

export interface Booking {
  id: string;
  lodgeId: string;
  lodgeName: string;
  roomId: string;
  roomName: string;
  roomNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  needsPickup: boolean;
  pickupLocation?: string;
  pickupFlightNumber?: string;
  pickupTime?: string;
  totalCost: number;
  createdAt: string;
}
