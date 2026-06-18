import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, Users, Car, Hotel, AlertCircle, Phone, Mail, Clock, Calendar, 
  MapPin, Check, X, ShieldAlert, ToggleLeft, ToggleRight, Sparkles 
} from 'lucide-react';
import { Lodge, Room, Booking } from '../types';
import { AVAILABLE_PICKUP_LOCATIONS } from '../data';

interface OwnerDashboardProps {
  lodges: Lodge[];
  rooms: Room[];
  bookings: Booking[];
  onToggleRoomStatus: (roomId: string) => void;
  onClearAllRecords: () => void;
  onAddManualBooking: (booking: Booking) => void;
}

export default function OwnerDashboard({ 
  lodges, 
  rooms, 
  bookings, 
  onToggleRoomStatus,
  onClearAllRecords,
  onAddManualBooking
}: OwnerDashboardProps) {

  const [selectedLodgeFilter, setSelectedLodgeFilter] = useState<string>('all');
  
  // State for manual booking simulator modal
  const [showManualSimulator, setShowManualSimulator] = useState(false);
  const [simName, setSimName] = useState('Dr. Alfred Nobel');
  const [simEmail, setSimEmail] = useState('alfred@nobel.org');
  const [simPhone, setSimPhone] = useState('+46 8 123 456');
  const [simRoomId, setSimRoomId] = useState('');
  const [simNeedsPickup, setSimNeedsPickup] = useState(true);
  const [simPickupLoc, setSimPickupLoc] = useState('Central Train & Coach Station (Zone 3 Pick-up Row)');
  const [simNights, setSimNights] = useState(2);

  // Computed metrics
  const portfolioMetrics = useMemo(() => {
    const totalRoomsCount = rooms.length;
    const bookedRoomsCount = rooms.filter(r => r.isBooked).length;
    const occupancyRate = totalRoomsCount > 0 ? Math.round((bookedRoomsCount / totalRoomsCount) * 100) : 0;
    
    // Sum active booking values
    const grossCumulativeRevenue = bookings.reduce((acc, curr) => acc + curr.totalCost, 0);
    const activePickupRequestsCount = bookings.filter(b => b.needsPickup).length;

    return {
      totalRoomsCount,
      bookedRoomsCount,
      occupancyRate,
      grossCumulativeRevenue,
      activePickupRequestsCount
    };
  }, [rooms, bookings]);

  // Filtered lists
  const displayedRooms = useMemo(() => {
    if (selectedLodgeFilter === 'all') return rooms;
    return rooms.filter((r) => r.lodgeId === selectedLodgeFilter);
  }, [rooms, selectedLodgeFilter]);

  const displayedBookings = useMemo(() => {
    if (selectedLodgeFilter === 'all') return bookings;
    return bookings.filter((b) => b.lodgeId === selectedLodgeFilter);
  }, [bookings, selectedLodgeFilter]);

  // Handle Manual Simulator booking
  const triggerSimulateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simRoomId) {
      alert("Please select a target room for simulation.");
      return;
    }
    
    const targetRoom = rooms.find(r => r.id === simRoomId);
    if (!targetRoom) return;

    if (targetRoom.isBooked) {
      alert("This room is already loaded or booked. Please release it or select another room.");
      return;
    }

    const matchedLodge = lodges.find(l => l.id === targetRoom.lodgeId)!;
    const totalCostAmt = (targetRoom.pricePerNight * simNights) + (simNeedsPickup ? 25 : 0);

    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 2); // 2 days out
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 2 + simNights);

    const simulatedBookingItem: Booking = {
      id: 'SIM_' + Math.floor(Math.random() * 9000 + 1000),
      lodgeId: targetRoom.lodgeId,
      lodgeName: matchedLodge.name,
      roomId: targetRoom.id,
      roomName: targetRoom.name,
      roomNumber: targetRoom.roomNumber,
      customerName: simName,
      customerEmail: simEmail,
      customerPhone: simPhone,
      checkInDate: checkInDate.toISOString().split('T')[0],
      checkOutDate: checkOutDate.toISOString().split('T')[0],
      guestsCount: 1,
      needsPickup: simNeedsPickup,
      pickupLocation: simNeedsPickup ? simPickupLoc : undefined,
      pickupFlightNumber: simNeedsPickup ? 'SIM-X78' : undefined,
      pickupTime: '15:30',
      totalCost: totalCostAmt,
      createdAt: new Date().toLocaleString()
    };

    onAddManualBooking(simulatedBookingItem);
    setShowManualSimulator(false);
  };

  return (
    <div className="space-y-8">
      {/* Introduction Deck */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-8 border border-stone-800 shadow-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-gold-600 text-[10px] font-mono tracking-widest font-bold uppercase">
            Havenwood Executive Command
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
            Lodges Director Dashboard
          </h2>
          <p className="text-stone-400 text-xs mt-1.5 max-w-xl">
            Analyze your boutique hotel assets across global domains. Synchronize room leases, track pick-up coordinators, and evaluate portfolio metrics in real-time.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            id="btn-trigger-simulator"
            onClick={() => {
              const availableRm = rooms.find(r => !r.isBooked);
              if (availableRm) {
                setSimRoomId(availableRm.id);
              }
              setShowManualSimulator(true);
            }}
            className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-stone-950 font-bold text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            SIMULATE EXTERNAL BOOKING
          </button>
          <button
            id="btn-clear-roster"
            onClick={onClearAllRecords}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs tracking-wider rounded-xl border border-stone-700 transition"
          >
            RESET ROOMS & RECORDS
          </button>
        </div>
      </div>

      {/* Primary KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
              Total Estate Revenue
            </span>
            <p className="font-mono text-2xl font-black text-stone-900 mt-1">
              ${portfolioMetrics.grossCumulativeRevenue}
            </p>
            <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +14.2% stay bookings values
            </p>
          </div>
          <div className="w-11 h-11 bg-stone-100 rounded-xl flex items-center justify-center text-stone-800">
            <TrendingUp className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
              Portfolio Occupancy
            </span>
            <p className="font-mono text-2xl font-black text-stone-900 mt-1">
              {portfolioMetrics.occupancyRate}%
            </p>
            <p className="text-[10px] text-stone-500 mt-1">
              {portfolioMetrics.bookedRoomsCount} of {portfolioMetrics.totalRoomsCount} rooms leased
            </p>
          </div>
          <div className="w-11 h-11 bg-stone-100 rounded-xl flex items-center justify-center text-stone-800">
            <Hotel className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
              VIP Pickup Duties
            </span>
            <p className="font-mono text-2xl font-black text-stone-900 mt-1">
              {portfolioMetrics.activePickupRequestsCount}
            </p>
            <p className="text-[10px] text-gold-700 font-medium mt-1">
              Active shuttle escorts queued
            </p>
          </div>
          <div className="w-11 h-11 bg-gold-50 text-gold-700 rounded-xl flex items-center justify-center">
            <Car className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
              Active Lodges Assets
            </span>
            <p className="font-mono text-2xl font-black text-stone-900 mt-1">
              {lodges.length}
            </p>
            <p className="text-[10px] text-stone-500 mt-1">
              Globally operating domains
            </p>
          </div>
          <div className="w-11 h-11 bg-stone-100 rounded-xl flex items-center justify-center text-stone-800">
            <Users className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Asset Selection Filter */}
      <div className="flex items-center gap-3 bg-stone-100 p-1.5 rounded-2xl max-w-sm border border-stone-200/40">
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 pl-2.5 font-bold">
          FILTERS:
        </span>
        <select
          id="select-owner-lodge-filter"
          value={selectedLodgeFilter}
          onChange={(e) => setSelectedLodgeFilter(e.target.value)}
          className="bg-white px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none flex-grow shadow-sm"
        >
          <option value="all">All Managed Lodges ({lodges.length})</option>
          {lodges.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Split layout: Managed Rooms matrix vs Active passengers manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Managed Rooms occupancy matrix */}
        <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl p-5 md:p-6 shadow-soft space-y-4">
          <div className="flex justify-between items-baseline border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Interactive Rooms Grid
              </h3>
              <p className="text-xs text-stone-500">
                Instantly toggle room booked/available status manually to simulate guest reservations
              </p>
            </div>
            <span className="text-[11px] font-mono text-stone-400 uppercase font-semibold">
              {displayedRooms.length} room rows
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-500 font-mono text-[10px] tracking-wider uppercase border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Room No. & Name</th>
                  <th className="py-3 px-4">Lodge Asset</th>
                  <th className="py-3 px-4">Class & Rates</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4 text-right">Instant Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {displayedRooms.map((room) => {
                  const correlatedLodge = lodges.find(l => l.id === room.lodgeId);
                  return (
                    <tr key={room.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Name / Info */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-[10px]">
                            {room.roomNumber}
                          </span>
                          <div>
                            <p className="font-semibold text-stone-900 leading-tight">{room.name}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">Capacity: {room.capacity} Guests · Amenity Count: {room.amenities.length}</p>
                          </div>
                        </div>
                      </td>

                      {/* Lodge Affiliation */}
                      <td className="py-3.5 px-4 font-medium text-stone-500">
                        {correlatedLodge ? correlatedLodge.name : 'Unknown Estate'}
                      </td>

                      {/* Class pricing */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-stone-900 font-semibold">${room.pricePerNight} </span>
                        <span className="text-[10px] text-stone-400">/ night</span>
                        <p className="text-[10px] font-bold text-stone-400 tracking-wider font-mono uppercase mt-0.5">
                          {room.type}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase ${
                          room.isBooked 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${room.isBooked ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                          {room.isBooked ? 'BOOKED' : 'VACANT'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`owner-toggle-${room.id}`}
                          onClick={() => onToggleRoomStatus(room.id)}
                          title="Click here to lock or release room in server memory"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all duration-300 ${
                            room.isBooked 
                              ? 'bg-stone-900 text-white border-stone-950 hover:bg-stone-800' 
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {room.isBooked ? 'RELEASE' : 'RESERVE'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active Passengers & Shuttles manifesting */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 md:p-6 shadow-soft space-y-4 flex flex-col h-full">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Shuttle Pickup Roster
            </h3>
            <p className="text-xs text-stone-500">
              Real-time directory of guests requiring incoming airport/station transport matching
            </p>
          </div>

          <div className="flex-grow overflow-y-auto space-y-3 max-h-[460px] pr-1">
            {displayedBookings.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <Car className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500 font-medium">No checked-in clients matching filters</p>
              </div>
            ) : (
              displayedBookings.map((b) => (
                <div 
                  id={`roster-card-${b.id}`}
                  key={b.id} 
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    b.needsPickup 
                      ? 'bg-gold-50/40 border-gold-200/80' 
                      : 'bg-stone-50/50 border-stone-100'
                  }`}
                >
                  <div className="flex justify-between items-baseline">
                    <strong className="text-stone-950 font-bold">{b.customerName}</strong>
                    <span className="font-mono text-[9px] text-stone-400 bg-white border px-1 rounded">
                      Id: {b.id}
                    </span>
                  </div>

                  <p className="text-stone-500 text-[11px] mt-1 font-mono">
                    Rm {b.roomNumber} · {b.lodgeName} · {b.checkInDate}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-dashed border-stone-200/85">
                    {b.needsPickup ? (
                      <div className="space-y-1.5 font-mono">
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-800 font-bold uppercase tracking-wide">
                          <Car className="w-3.5 h-3.5 text-amber-600" />
                          <span>VIP CHAUFFEUR COORDINATED</span>
                        </div>
                        <p className="text-stone-700 leading-tight">
                          <span className="text-stone-400 font-sans font-normal block font-medium">Point Location:</span>
                          {b.pickupLocation}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <p className="text-stone-700 leading-tight">
                            <span className="text-stone-400 font-sans font-normal block">ETA Driver:</span>
                            {b.pickupTime}
                          </p>
                          <p className="text-stone-700 leading-tight">
                            <span className="text-stone-400 font-sans font-normal block">Flight:</span>
                            {b.pickupFlightNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-stone-400 text-[10px]">
                        <X className="w-3.5 h-3.5" />
                        <span>Self-Arrival arranged (No chauffeur)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ================= MANUAL External Booking Simulated Modal ================= */}
      {showManualSimulator && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-stone-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Simulate Client Reservation
              </h3>
              <button 
                onClick={() => setShowManualSimulator(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              This terminal mocks an external client calling or using a third-party service (Expedia, Booking.com) to block a suite. This highlights how our room state updates automatically!
            </p>

            <form onSubmit={triggerSimulateBooking} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                  Assigned Target Suite
                </label>
                <select
                  id="simulate-room-select"
                  value={simRoomId}
                  onChange={(e) => setSimRoomId(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-xl bg-stone-50 font-medium"
                >
                  <option value="" disabled>Select room...</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id} disabled={r.isBooked}>
                      Rm {r.roomNumber} · {r.name} {r.isBooked ? '[RESERVED]' : `[\$${r.pricePerNight}/n]`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                    Client Name
                  </label>
                  <input
                    id="input-sim-name"
                    type="text"
                    required
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                    Phone Number
                  </label>
                  <input
                    id="input-sim-phone"
                    type="text"
                    required
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                  Email Details
                </label>
                <input
                  id="input-sim-email"
                  type="email"
                  required
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                    Nights Length
                  </label>
                  <input
                    id="input-sim-nights"
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={simNights}
                    onChange={(e) => setSimNights(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    id="sim-needs-pickup"
                    type="checkbox"
                    checked={simNeedsPickup}
                    onChange={(e) => setSimNeedsPickup(e.target.checked)}
                    className="w-4.5 h-4.5 text-stone-900 accent-stone-900 cursor-pointer"
                  />
                  <label htmlFor="sim-needs-pickup" className="text-[11px] font-bold text-stone-700 cursor-pointer">
                    Request Pickup?
                  </label>
                </div>
              </div>

              {simNeedsPickup && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                  <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                    Pickup Location
                  </label>
                  <select
                    id="sim-pickup-location"
                    value={simPickupLoc}
                    onChange={(e) => setSimPickupLoc(e.target.value)}
                    className="w-full p-1.5 max-w-full bg-white border border-stone-200 rounded text-[11px]"
                  >
                    {AVAILABLE_PICKUP_LOCATIONS.map((loc, i) => (
                      <option key={i} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                id="btn-confirm-simulated-booking"
                type="submit"
                className="w-full py-2.5 bg-stone-900 text-gold-100 hover:bg-gold-700 hover:text-stone-950 font-bold text-xs tracking-wider uppercase rounded-xl transition shadow-md"
              >
                SUBMIT SIMULATED STAY
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
