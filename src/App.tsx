import { useState, useEffect, useMemo } from 'react';
import { 
  Compass, SlidersHorizontal, MapPin, Sparkles, AlertCircle, Info, CheckCircle, HelpCircle, Phone, Mail 
} from 'lucide-react';
import Header from './components/Header';
import LodgeCard from './components/LodgeCard';
import RoomModal from './components/RoomModal';
import BookingList from './components/BookingList';
import OwnerDashboard from './components/OwnerDashboard';
import { INITIAL_LODGES, INITIAL_ROOMS } from './data';
import { Lodge, Room, Booking } from './types';

export default function App() {
  // Navigation & view states
  const [isOwnerView, setIsOwnerView] = useState(false);
  const [selectedLodge, setSelectedLodge] = useState<Lodge | null>(null);

  // Core synchronized data states
  const [lodges, setLodges] = useState<Lodge[]>(INITIAL_LODGES);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  // Trigger loading state from LocalStorage on mount
  useEffect(() => {
    try {
      const storedRooms = localStorage.getItem('havenwood_rooms');
      const storedBookings = localStorage.getItem('havenwood_bookings');

      if (storedRooms) {
        setRooms(JSON.parse(storedRooms));
      } else {
        // Initial first load seeding
        setRooms(INITIAL_ROOMS);
        localStorage.setItem('havenwood_rooms', JSON.stringify(INITIAL_ROOMS));
      }

      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      } else {
        // Set standard empty bookings, or populate 1 initial booked item for visual clarity
        const initialBookings: Booking[] = [
          {
            id: 'BK_9021',
            lodgeId: 'l1',
            lodgeName: 'Whitetail Pine Lodge',
            roomId: 'r1_3',
            roomName: 'The Summit Grand Penthouse',
            roomNumber: '201',
            customerName: 'Lady Augusta Byron',
            customerEmail: 'augusta@byron.co.uk',
            customerPhone: '+44 7911 123456',
            checkInDate: '2026-06-20',
            checkOutDate: '2026-06-25',
            guestsCount: 2,
            needsPickup: true,
            pickupLocation: 'International Airport Terminal A (Arrivals Hall)',
            pickupFlightNumber: 'BA-295',
            pickupTime: '13:15',
            totalCost: 2775,
            createdAt: '2026-06-17 14:24:10'
          }
        ];
        setBookings(initialBookings);
        localStorage.setItem('havenwood_bookings', JSON.stringify(initialBookings));
      }
    } catch (e) {
      console.error('Failed to load storage values, falling back to static lists:', e);
      setRooms(INITIAL_ROOMS);
      setBookings([]);
    }
  }, []);

  // Save states helper
  const updateRoomsAndPersist = (newRoomsList: Room[]) => {
    setRooms(newRoomsList);
    localStorage.setItem('havenwood_rooms', JSON.stringify(newRoomsList));
  };

  const updateBookingsAndPersist = (newBookingsList: Booking[]) => {
    setBookings(newBookingsList);
    localStorage.setItem('havenwood_bookings', JSON.stringify(newBookingsList));
  };

  // Upstream handlers
  const handleBookRoom = (params: {
    room: Room;
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
  }) => {
    // 1. Mark corresponding room as booked
    const updatedRooms = rooms.map((r) => {
      if (r.id === params.room.id) {
        return { ...r, isBooked: true };
      }
      return r;
    });
    updateRoomsAndPersist(updatedRooms);

    // 2. Insert new booking item
    const newBooking: Booking = {
      id: 'BK_' + Math.floor(Math.random() * 9000 + 1000),
      lodgeId: params.room.lodgeId,
      lodgeName: lodges.find((l) => l.id === params.room.lodgeId)?.name || 'Luxury Lodge',
      roomId: params.room.id,
      roomName: params.room.name,
      roomNumber: params.room.roomNumber,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      guestsCount: params.guestsCount,
      needsPickup: params.needsPickup,
      pickupLocation: params.pickupLocation,
      pickupFlightNumber: params.pickupFlightNumber,
      pickupTime: params.pickupTime,
      totalCost: params.totalCost,
      createdAt: new Date().toLocaleString()
    };

    const updatedBookings = [newBooking, ...bookings];
    updateBookingsAndPersist(updatedBookings);
  };

  const handleCancelBooking = (bookingId: string, roomId: string) => {
    // 1. Filter out the targeted booking
    const remainingBookings = bookings.filter((b) => b.id !== bookingId);
    updateBookingsAndPersist(remainingBookings);

    // 2. Mark the room back to available vacancy
    const releasedRooms = rooms.map((r) => {
      if (r.id === roomId) {
        return { ...r, isBooked: false };
      }
      return r;
    });
    releasedRooms.forEach((r) => {
      if (r.id === roomId) r.isBooked = false;
    });
    updateRoomsAndPersist(releasedRooms);
  };

  // Owner manual overrides
  const handleToggleRoomStatus = (roomId: string) => {
    const updatedRooms = rooms.map((r) => {
      if (r.id === roomId) {
        const nextState = !r.isBooked;
        
        // If we are releasing, remove any active booking associated with it
        if (!nextState) {
          const updatedBookings = bookings.filter((b) => b.roomId !== roomId);
          updateBookingsAndPersist(updatedBookings);
        } else {
          // If we are marking as booked administratively, make a mock administrative booking
          const matchedLodge = lodges.find(l => l.id === r.lodgeId)!;
          const mockAdminBooking: Booking = {
            id: 'BK_ADM_' + Math.floor(Math.random() * 900 + 100),
            lodgeId: r.lodgeId,
            lodgeName: matchedLodge.name,
            roomId: r.id,
            roomName: r.name,
            roomNumber: r.roomNumber,
            customerName: 'Portfolio Manager Walk-In',
            customerEmail: 'walkin@havenwood.com',
            customerPhone: '+1 (555) OFFICE',
            checkInDate: new Date().toISOString().split('T')[0],
            checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
            guestsCount: 1,
            needsPickup: false,
            totalCost: r.pricePerNight,
            createdAt: new Date().toLocaleString()
          };
          updateBookingsAndPersist([mockAdminBooking, ...bookings]);
        }

        return { ...r, isBooked: nextState };
      }
      return r;
    });
    updateRoomsAndPersist(updatedRooms);
  };

  // Simulator helper
  const handleAddManualBooking = (simulatedBooking: Booking) => {
    // Lock the room
    const updatedRooms = rooms.map((r) => {
      if (r.id === simulatedBooking.roomId) {
        return { ...r, isBooked: true };
      }
      return r;
    });
    updateRoomsAndPersist(updatedRooms);
    updateBookingsAndPersist([simulatedBooking, ...bookings]);
  };

  const handleClearAllRecords = () => {
    if (confirm("Are you sure you want to restore default estate values? This clears all simulated guest bookings.")) {
      updateRoomsAndPersist(INITIAL_ROOMS);
      updateBookingsAndPersist([]);
      localStorage.removeItem('havenwood_rooms');
      localStorage.removeItem('havenwood_bookings');
    }
  };

  // Filter and search calculations
  const filteredLodges = useMemo(() => {
    return lodges.filter((lodge) => {
      const matchesSearch = 
        lodge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lodge.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lodge.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter based on selected room criteria types if selected
      if (selectedTypeFilter === 'all') return matchesSearch;

      const lodgeRooms = rooms.filter((r) => r.lodgeId === lodge.id);
      const hasSpecificRoomType = lodgeRooms.some((r) => r.type.toLowerCase() === selectedTypeFilter.toLowerCase());
      
      return matchesSearch && hasSpecificRoomType;
    });
  }, [lodges, rooms, searchQuery, selectedTypeFilter]);

  // Count vacancies for each lodge dynamically
  const getLodgeVacanciesCount = (lodgeId: string) => {
    const lodgeRooms = rooms.filter((r) => r.lodgeId === lodgeId);
    return lodgeRooms.filter((r) => !r.isBooked).length;
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-stone-900 selection:bg-gold-100 selection:text-gold-900">
      
      {/* Universal Header */}
      <Header 
        isOwnerView={isOwnerView} 
        setIsOwnerView={setIsOwnerView} 
        activeBookingsCount={bookings.length}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        {isOwnerView ? (
          /* ================= OWNER mode view panel ================= */
          <div className="animate-fadeIn">
            <OwnerDashboard 
              lodges={lodges}
              rooms={rooms}
              bookings={bookings}
              onToggleRoomStatus={handleToggleRoomStatus}
              onClearAllRecords={handleClearAllRecords}
              onAddManualBooking={handleAddManualBooking}
            />
          </div>
        ) : (
          /* ================= GUEST traveler view panel ================= */
          <div className="space-y-12 animate-fadeIn">
            
            {/* Elegant luxury visual hero */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 text-white p-8 md:p-12 lg:p-16 shadow-premium flex flex-col justify-end min-h-[340px] md:min-h-[400px]">
              {/* Background cover image overlay */}
              <div className="absolute inset-0 z-0 opacity-45 mix-blend-luminosity">
                <img 
                  src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80" 
                  alt="Scenic Alpine" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent z-10"></div>

              {/* Text Area */}
              <div className="relative z-20 max-w-2xl space-y-3 md:space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-[#e2d5ab] border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 fill-[#e2d5ab]/20" />
                  AUTHENTIC COMFORT SPACES
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                  Discover a Sanctuary Created for True Belonging
                </h2>
                <p className="text-xs md:text-sm text-stone-300 leading-relaxed max-w-xl">
                  Step away from the crowd into Havenwood's hand-crafted private log retreats, sun-baked volcanic suites, and savannah glamping sanctuaries. Secure your luxury room instantly with real-time slot lock validation and complimentary transport.
                </p>
              </div>
            </div>

            {/* Traveler Stays overview drawer */}
            {bookings.length > 0 && (
              <section className="bg-[#f5f3e7] border border-gold-200/50 p-6 md:p-8 rounded-3xl shadow-soft">
                <BookingList 
                  bookings={bookings} 
                  onCancelBooking={handleCancelBooking} 
                />
              </section>
            )}

            {/* Lodge explorer menu */}
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-stone-200 pb-5">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Explore Our Lodge Portfolios
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Filter by destination types or lodging styles to find vacant suites fitted to your parties
                  </p>
                </div>

                {/* Filter and Search controls */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                    <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="search-lodge-query"
                      type="text"
                      placeholder="Search locations or names..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-all shadow-sm"
                    />
                  </div>

                  {/* Room Type dropdown */}
                  <div className="relative flex-grow sm:flex-grow-0">
                    <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <select
                      id="filter-room-type-dropdown"
                      value={selectedTypeFilter}
                      onChange={(e) => setSelectedTypeFilter(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none shadow-sm cursor-pointer"
                    >
                      <option value="all">All Room Styles</option>
                      <option value="suite">Suites Available</option>
                      <option value="standard">Standard Rooms</option>
                      <option value="penthouse">Penthouses</option>
                      <option value="family">Family Villas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid cards listing */}
              {filteredLodges.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto space-y-3">
                  <div className="h-12 w-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
                    <AlertCircle className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900">No Matching Lodges Found</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    We couldn't locate any cabins matching "{searchQuery}" or style parameters. Try broadening your keywords!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  {filteredLodges.map((lodge) => (
                    <div key={lodge.id}>
                      <LodgeCard
                        lodge={lodge}
                        availableRoomsCount={getLodgeVacanciesCount(lodge.id)}
                        onExploreRooms={(l) => setSelectedLodge(l)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Primary Rooms selections drawer modal overlay */}
      {selectedLodge && (
        <RoomModal
          lodge={selectedLodge}
          rooms={rooms}
          onClose={() => setSelectedLodge(null)}
          onBookRoom={handleBookRoom}
          activeBookings={bookings}
        />
      )}

      {/* Universal Soft Footing credits */}
      <footer className="border-t border-stone-200/50 mt-20 bg-stone-50 py-10 px-4 md:px-8 text-center text-xs text-stone-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Havenwood Estates Lodging Alliance. Synchronized Live Management System Active.</p>
          <div className="flex gap-4">
            <span className="hover:text-stone-600 cursor-help">Secure SSL Validation</span>
            <span>·</span>
            <span className="hover:text-stone-600 cursor-help">Boutique Executive Desk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
