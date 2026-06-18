import { Lodge, Room } from './types';

export const INITIAL_LODGES: Lodge[] = [
  {
    id: 'l1',
    name: 'Whitetail Pine Lodge',
    location: 'Aspen, Colorado',
    description: 'A cozy timber oasis surrounded by towering pine trees and dramatic alpine snowfields. Features direct ski-in/ski-out access, rustic open fireplaces, and a heated mineral pool under the mountain stars.',
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    featuredAmenity: 'Ski-in / Ski-out Access',
    basePrice: 240
  },
  {
    id: 'l2',
    name: 'Serengeti Horizon Lodge',
    location: 'Maasai Mara, Kenya',
    description: 'An elevated safari retreat perched on a limestone ridge, boasting panoramic views of wildlife migrations on the savanna plains below. Architected with traditional thatch work and local teak timber.',
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    featuredAmenity: 'Guided Wildlife Drives',
    basePrice: 320
  },
  {
    id: 'l3',
    name: 'Cliffside Ridge Haven',
    location: 'Santorini, Greece',
    description: 'A minimalist white-walled cliff enclave suspended above the azure waters of the Aegean sea. Enjoy spectacular volcanic sunset vistas, dynamic private infinity plunge pools, and exquisite regional fine dining.',
    image: 'https://images.unsplash.com/photo-1469796466635-455edd028abd?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    featuredAmenity: 'Private Caldera Pool',
    basePrice: 450
  },
  {
    id: 'l4',
    name: 'Redwood Canopy Lodge',
    location: 'Big Sur, California',
    description: 'A glass-and-steel architectural wonder nestled deep within a prehistoric forest of coast redwood behemoths. Features soundproof private viewing decks, artisanal organic local foods, and soothing sound therapy creeks.',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    rating: 4.75,
    featuredAmenity: 'Forest Bathing & Treetop Walks',
    basePrice: 290
  }
];

export const INITIAL_ROOMS: Room[] = [
  // Lodge 1: Whitetail Pine Lodge
  {
    id: 'r1_1',
    lodgeId: 'l1',
    roomNumber: '101',
    name: 'Alpine Hearth King Suite',
    type: 'Suite',
    pricePerNight: 290,
    capacity: 2,
    amenities: ['Stone Fireplace', 'Private Balcony', 'Outdoor Hot Tub Access', 'Nespresso Bar', 'Heated Floors'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    isBooked: false,
    description: 'A masterfully crafted suite anchored by a wood-burning stone fireplace, king-size featherbed, and customized bath therapies overlooking the ski slopes.'
  },
  {
    id: 'r1_2',
    lodgeId: 'l1',
    roomNumber: '102',
    name: 'Forestview Queen Room',
    type: 'Standard',
    pricePerNight: 190,
    capacity: 2,
    amenities: ['Forest Views', 'HD Screen', 'Rain Shower', 'Organic Robes'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    isBooked: false,
    description: 'Elegant queen comfort featuring tall picture windows facing the pristine spruce woodlands, premium linen, and artisanal pine accessories.'
  },
  {
    id: 'r1_3',
    lodgeId: 'l1',
    roomNumber: '201',
    name: 'The Summit Grand Penthouse',
    type: 'Penthouse',
    pricePerNight: 550,
    capacity: 4,
    amenities: ['Panoramic Peak Views', 'Full Timber Kitchen', 'Billiard Table', 'Sauna Room', 'Personal Concierge'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    isBooked: true, // Initial booked state to show immediate reactive availability changes
    description: 'An expansive architectural loft with high vaulted log structural ceilings, custom iron works, 360-degree alpine scenery, and private wellness spa.'
  },

  // Lodge 2: Serengeti Horizon Lodge
  {
    id: 'r2_1',
    lodgeId: 'l2',
    roomNumber: '202A',
    name: 'Savanna Sunset Canopy Suite',
    type: 'Suite',
    pricePerNight: 390,
    capacity: 2,
    amenities: ['Panoramic Vista Deck', 'Outdoor Soak Tub', 'Telescope & Stargazing kit', 'Premium Mini Bar'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    isBooked: false,
    description: 'Raised high on stilts with flowy white linen drapes, hand-carved mahogany fittings, and an spectacular open deck for game viewing.'
  },
  {
    id: 'r2_2',
    lodgeId: 'l2',
    roomNumber: '104B',
    name: 'Mara Family Bush Villa',
    type: 'Family',
    pricePerNight: 480,
    capacity: 5,
    amenities: ['Multi-Room Suite', 'Firepit Lounge', 'Personal Chef Options', 'Binoculars & Safari Pack'],
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    isBooked: false,
    description: 'Designed for family safaris with private gathering quarters, direct step-out to the grassland viewing lawns, and high security enclosures.'
  },

  // Lodge 3: Cliffside Ridge Haven
  {
    id: 'r3_1',
    lodgeId: 'l3',
    roomNumber: '301',
    name: 'Caldera Calderon Luxury Suite',
    type: 'Suite',
    pricePerNight: 620,
    capacity: 2,
    amenities: ['Heated Eclipse Pool', 'Plush Lounge Deck', 'Complimentary Champagne', 'Spa Bath'],
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    isBooked: false,
    description: 'Carved directly into the white volcanic ash cliffside, featuring minimalist Cycladic arches, cave-shower therapies, and an unbeatable private caldera horizon pool.'
  },
  {
    id: 'r3_2',
    lodgeId: 'l3',
    roomNumber: '302',
    name: 'Aegean Drift Standard Studio',
    type: 'Standard',
    pricePerNight: 380,
    capacity: 2,
    amenities: ['Cliffside Sunset Views', 'Veranda Daybed', 'Bluetooth Speaker System'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    isBooked: false,
    description: 'Stately sun-drenched sanctuary with soft Aegean blue tiles, white stone furniture, and a private sea-breeze sun terrace.'
  },

  // Lodge 4: Redwood Canopy Lodge
  {
    id: 'r4_1',
    lodgeId: 'l4',
    roomNumber: 'A1',
    name: 'Ancient Treehouse Deluxe',
    type: 'Deluxe',
    pricePerNight: 350,
    capacity: 2,
    amenities: ['Wrap-around Glass Balcony', 'Skylight Ceiling', 'Soaking Copper Tub', 'Eco-Heat Pump'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    isBooked: false,
    description: 'Suspended 30 feet in the giant needles, with custom triple-glazed structural sky-lantern ceilings for sleeping directly under the redwood stars.'
  },
  {
    id: 'r4_2',
    lodgeId: 'l4',
    roomNumber: 'A2',
    name: 'Fern Valley Creek Cabin',
    type: 'Family',
    pricePerNight: 410,
    capacity: 4,
    amenities: ['Rustic Indoor Stove', 'Creek-Side Dining Table', 'Zen Garden Entry', 'Hi-Fi Record Player'],
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
    isBooked: false,
    description: 'A woodward haven alongside a dynamic babbling water run. Stocked with warm wool throws, classic vintage records, and premium loose-leaf local herb teas.'
  }
];
export const AVAILABLE_PICKUP_LOCATIONS = [
  'International Airport Terminal A (Arrivals Hall)',
  'Domestic Airport Terminal B (Arrivals Hall)',
  'Central Train & Coach Station (Zone 3 Pick-up Row)',
  'Metropolitan Harbour Ferry Pier 5 (Gate C)',
  'Main City Centre Express Terminal'
];
