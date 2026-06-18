import React, { useState, useMemo } from 'react';
import { X, Calendar, User, Phone, Mail, Car, Plane, Clock, ShieldCheck, Check, Info } from 'lucide-react';
import { Lodge, Room, Booking } from '../types';
import { AVAILABLE_PICKUP_LOCATIONS } from '../data';

interface RoomModalProps {
  lodge: Lodge;
  rooms: Room[];
  onClose: () => void;
  onBookRoom: (params: {
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
  }) => void;
  activeBookings: Booking[];
}

export default function RoomModal({ lodge, rooms, onClose, onBookRoom, activeBookings }: RoomModalProps) {
  // Filter rooms for this lodge
  const lodgeRooms = useMemo(() => {
    return rooms.filter((r) => r.lodgeId === lodge.id);
  }, [rooms, lodge.id]);

  // Selected Room state (default to first available, or first room)
  const [selectedRoom, setSelectedRoom] = useState<Room>(() => {
    const available = lodgeRooms.find((r) => !r.isBooked);
    return available || lodgeRooms[0];
  });

  // Stay form details
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  // Dates (Default check-in: tomorrow, check-out: day after tomorrow)
  const todayStr = useMemo(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }, []);

  const tomorrowStr = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }, []);

  const dayAfterTomorrowStr = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  }, []);

  const [checkIn, setCheckIn] = useState(tomorrowStr);
  const [checkOut, setCheckOut] = useState(dayAfterTomorrowStr);
  const [guestsCount, setGuestsCount] = useState(1);

  // Pick up coordination options
  const [needsPickup, setNeedsPickup] = useState(false);
  const [pickupLoc, setPickupLoc] = useState(AVAILABLE_PICKUP_LOCATIONS[0]);
  const [flightNumber, setFlightNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('14:00');

  // Booking success animations and display
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [validationError, setValidationError] = useState('');

  // Calculate nights
  const nightsCount = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
  }, [checkIn, checkOut]);

  // Calculate total costs
  const pickupFee = needsPickup ? 25 : 0;
  const stayCost = selectedRoom.pricePerNight * nightsCount;
  const finalTotalAmount = stayCost + pickupFee;

  // Find active booking details if the selected room is already booked
  const existingBookingForSelectedRoom = useMemo(() => {
    if (!selectedRoom.isBooked) return null;
    return activeBookings.find(b => b.roomId === selectedRoom.id);
  }, [selectedRoom, activeBookings]);

  // Perform Booking action
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (selectedRoom.isBooked) {
      setValidationError('This room is currently reserved. Please select another available suite.');
      return;
    }

    if (!userName.trim()) {
      setValidationError('Please input the primary guest name.');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setValidationError('Please specify a valid email address.');
      return;
    }
    if (!userPhone.trim()) {
      setValidationError('Please provide a contact phone number.');
      return;
    }

    const checkInDateObj = new Date(checkIn);
    const checkOutDateObj = new Date(checkOut);
    if (checkOutDateObj <= checkInDateObj) {
      setValidationError('Check-out date must follow your selected check-in date.');
      return;
    }

    // Call upstream action
    const stayBookingData = {
      room: selectedRoom,
      customerName: userName,
      customerEmail: userEmail,
      customerPhone: userPhone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount,
      needsPickup,
      pickupLocation: needsPickup ? pickupLoc : undefined,
      pickupFlightNumber: (needsPickup && flightNumber) ? flightNumber : undefined,
      pickupTime: needsPickup ? pickupTime : undefined,
      totalCost: finalTotalAmount
    };

    onBookRoom(stayBookingData);

    // Create immediate success visual summary
    const newBookingWithId: Booking = {
      id: 'BK_' + Math.floor(Math.random() * 1000000),
      lodgeId: lodge.id,
      lodgeName: lodge.name,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      roomNumber: selectedRoom.roomNumber,
      customerName: userName,
      customerEmail: userEmail,
      customerPhone: userPhone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount,
      needsPickup,
      pickupLocation: needsPickup ? pickupLoc : undefined,
      pickupFlightNumber: (needsPickup && flightNumber) ? flightNumber : undefined,
      pickupTime: needsPickup ? pickupTime : undefined,
      totalCost: finalTotalAmount,
      createdAt: new Date().toLocaleString()
    };

    setSuccessBooking(newBookingWithId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] border border-stone-100">
        
        {/* Header Ribbon */}
        <div className="bg-stone-900 text-white px-6 md:px-8 py-5 flex justify-between items-center shrink-0">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#d6c584] uppercase font-bold">
              Available Lodging Portfolio
            </span>
            <h2 className="font-serif text-xl md:text-2xl font-bold tracking-tight">
              {lodge.name} <span className="font-sans font-light text-stone-400">· {lodge.location}</span>
            </h2>
          </div>
          <button 
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 rounded-full text-stone-300 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successBooking ? (
          /* ================= SUCCESS ENVELOPE SHEET ================= */
          <div className="p-6 md:p-10 flex-grow overflow-y-auto flex flex-col items-center justify-center text-center max-w-xl mx-auto">
            {/* Round animated ticks */}
            <div className="w-16 h-16 bg-emerald-100 border-4 border-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-bounce">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>

            <h3 className="font-serif text-2xl font-black text-stone-900 leading-tight">
              Stay Confirmed & Locked!
            </h3>
            <p className="text-stone-500 text-xs mt-2 leading-relaxed">
              Congratulations! Your reservation at <strong className="text-stone-800">{lodge.name}</strong> has been saved. The lodge rooms catalogue has updated instantly.
            </p>

            {/* Custom Boarding Ticket Design */}
            <div className="w-full mt-6 bg-stone-50 border border-stone-200/80 rounded-2xl overflow-hidden shadow-soft text-left">
              {/* Upper Section */}
              <div className="p-4 border-b border-dashed border-stone-200 bg-white">
                <div className="flex justify-between text-[10px] text-stone-400 font-mono tracking-wider font-semibold">
                  <span>BOOKING REFERENCE</span>
                  <span>CONFIRMED GUEST</span>
                </div>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="font-mono text-sm font-bold text-stone-900">{successBooking.id}</span>
                  <span className="font-sans text-xs font-semibold text-stone-700">{successBooking.customerName}</span>
                </div>
              </div>

              {/* Middle Section */}
              <div className="p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 font-medium block">Room Accommodation</span>
                  <span className="font-bold text-stone-800">{successBooking.roomName} (Rm {successBooking.roomNumber})</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Length of Stay</span>
                  <span className="font-bold text-stone-800">{nightsCount} night{nightsCount > 1 ? 's' : ''}</span>
                </div>

                <div className="border-t border-stone-100 pt-3">
                  <span className="text-stone-400 font-medium block">Check-In Arrival</span>
                  <span className="font-mono text-stone-800 font-semibold">{successBooking.checkInDate}</span>
                </div>
                <div className="border-t border-stone-100 pt-3">
                  <span className="text-stone-400 font-medium block">Check-Out Departure</span>
                  <span className="font-mono text-stone-800 font-semibold">{successBooking.checkOutDate}</span>
                </div>
              </div>

              {/* Shuttle pickup card */}
              {successBooking.needsPickup ? (
                <div className="mx-4 mb-4 p-3 bg-gold-50/50 border border-gold-200/60 rounded-xl flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-stone-800 font-mono uppercase tracking-wide">
                      RESERVED SHUTTLE PICKUP
                    </h5>
                    <p className="text-[10px] text-stone-600 mt-1">
                      Our private courier will meet you at <strong className="text-stone-800">{successBooking.pickupLocation}</strong> at <strong className="text-stone-800">{successBooking.pickupTime}</strong>.
                    </p>
                    {successBooking.pickupFlightNumber && (
                      <p className="text-[9px] text-stone-400 mt-0.5 font-mono">
                        Flight/Transit ID: {successBooking.pickupFlightNumber}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mx-4 mb-4 p-3 bg-stone-100/50 border border-stone-200/50 rounded-xl flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-stone-600 font-mono uppercase tracking-wide">
                      SELF-ARRIVAL ARRANGED
                    </h5>
                    <p className="text-[10px] text-stone-500 mt-1">
                      No private pickup required. Check-in window starts at 14:00. Safe travels!
                    </p>
                  </div>
                </div>
              )}

              {/* Footer pricing section */}
              <div className="bg-stone-900 text-stone-100 p-4 flex justify-between items-center text-xs">
                <span>Receipt Gross Total:</span>
                <span className="text-base font-bold font-mono text-gold-200">${successBooking.totalCost} USD</span>
              </div>
            </div>

            <button
              id="btn-dismiss-success"
              onClick={onClose}
              className="mt-8 px-8 py-3 bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider rounded-xl transition-all duration-300"
            >
              RETURN TO CATALOGUE
            </button>
          </div>
        ) : (
          /* ================= MAIN SPLIT RESERVATION SCHEDULER ================= */
          <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Column: Room list and overview */}
            <div className="w-full md:w-[45%] bg-stone-50 border-r border-stone-100 overflow-y-auto p-5 md:p-6 flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 font-mono">
                Select Suite Preference
              </h4>
              
              <div className="space-y-3">
                {lodgeRooms.map((room) => {
                  const isSelected = selectedRoom.id === room.id;
                  return (
                    <div
                      id={`room-selection-item-${room.id}`}
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`cursor-pointer group flex flex-col p-4 rounded-2xl border transition-all duration-300 ${
                        isSelected 
                          ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                          : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300 shadow-soft'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Little thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                          <img 
                            src={room.image} 
                            alt={room.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Room info */}
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <h5 className={`text-xs md:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                              {room.name}
                            </h5>
                            <span className={`text-[10px] font-mono font-bold uppercase shrink-0 py-0.5 px-2 rounded-full ${
                              room.isBooked 
                                ? (isSelected ? 'bg-rose-500/30 text-rose-300 border border-rose-500/30' : 'bg-rose-50 text-rose-600 border border-rose-100')
                                : (isSelected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-100')
                            }`}>
                              {room.isBooked ? 'Booked' : 'Available'}
                            </span>
                          </div>

                          <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                            Room #{room.roomNumber} · Max {room.capacity} guests
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase ${isSelected ? 'text-gold-200' : 'text-gold-700'}`}>
                              {room.type} Class
                            </span>
                            <span className="text-xs font-mono font-bold">
                              ${room.pricePerNight}<span className={`text-[10px] font-normal ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>/night</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Room Details Feature Board */}
              <div className="mt-auto pt-6 border-t border-stone-200/80">
                <h5 className="text-[11px] font-bold text-stone-900 uppercase font-mono tracking-widest mb-2.5">
                  ROOM ARCHITECTURE
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {selectedRoom.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.amenities.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-[10px] font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Reactive Booking form details */}
            <form 
              id="form-booking-room"
              onSubmit={handleBookingSubmit}
              className="w-full md:w-[55%] p-6 md:p-8 overflow-y-auto flex flex-col"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#937d3c] font-mono mb-6">
                Guest Stay Terminal
              </h4>

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                  {validationError}
                </div>
              )}

              {selectedRoom.isBooked ? (
                /* Room is already reserved display */
                <div className="p-6 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-col items-center justify-center text-center my-auto">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mb-4">
                    <Info className="w-5 h-5" />
                  </div>
                  <h5 className="font-serif text-lg font-bold text-stone-900">
                    Suite {selectedRoom.roomNumber} is Reserved
                  </h5>
                  <p className="text-xs text-stone-500 max-w-sm mt-2 leading-relaxed">
                    This beautiful room has already been booked by another customer. 
                  </p>
                  
                  {existingBookingForSelectedRoom ? (
                    <div className="mt-4 p-3 bg-stone-200/30 border border-stone-200 rounded-xl text-left w-full text-xs">
                      <p className="font-mono text-[10px] text-stone-400 tracking-wider">RESERVATION IN RECORD</p>
                      <p className="font-bold text-stone-800 mt-1">Guest: {existingBookingForSelectedRoom.customerName}</p>
                      <p className="text-stone-500 mt-0.5">Staying: {existingBookingForSelectedRoom.checkInDate} to {existingBookingForSelectedRoom.checkOutDate}</p>
                      {existingBookingForSelectedRoom.needsPickup && (
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 rounded-lg px-2 py-0.5 border border-amber-200">
                          <Car className="w-3 h-3" /> Pickup coordinated
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-400 font-mono mt-2">Booked in our records.</p>
                  )}

                  <p className="text-xs text-stone-600 mt-5 font-semibold">
                    Please click another room on the left grid!
                  </p>
                </div>
              ) : (
                /* Room is available and ready to book */
                <div className="space-y-4">
                  {/* Personal details inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                        Guest Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          id="input-customer-name"
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Elizabeth Bennett"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          id="input-customer-phone"
                          type="tel"
                          required
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          placeholder="+1 (555) 0192"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="input-customer-email"
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="elizabeth@meryton.org"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                      />
                    </div>
                  </div>

                  {/* Dates selections */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                        Check-In Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input
                          id="input-checkin-date"
                          type="date"
                          required
                          min={todayStr}
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                        Check-Out Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input
                          id="input-checkout-date"
                          type="date"
                          required
                          min={checkIn || todayStr}
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                        Total Guests
                      </label>
                      <select
                        id="select-guests-count"
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                      >
                        {Array.from({ length: selectedRoom.capacity }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} Guest{n > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pick Up Shuttle Requirements */}
                  <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200/60 mt-4 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Car className="w-4 h-4 text-stone-800" />
                        <div>
                          <label htmlFor="checkbox-pickup-required" className="text-xs font-bold text-stone-900 block cursor-pointer">
                            Request Private Station/Airport Pickup?
                          </label>
                          <span className="text-[10px] text-stone-500">
                            Our private lodge drivers coordinate pickup at local transit hubs
                          </span>
                        </div>
                      </div>
                      <input
                        id="checkbox-pickup-required"
                        type="checkbox"
                        checked={needsPickup}
                        onChange={(e) => setNeedsPickup(e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-stone-900 accent-stone-900 cursor-pointer"
                      />
                    </div>

                    {needsPickup && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-stone-200/60 transition-all animate-fadeIn">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                            Pickup Terminal / Junction Point
                          </label>
                          <select
                            id="select-pickup-location"
                            value={pickupLoc}
                            onChange={(e) => setPickupLoc(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                          >
                            {AVAILABLE_PICKUP_LOCATIONS.map((loc, i) => (
                              <option key={i} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                            Flight / Train Number <span className="text-stone-400 font-normal">(Optional)</span>
                          </label>
                          <div className="relative">
                            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                            <input
                              id="input-pickup-transit-no"
                              type="text"
                              value={flightNumber}
                              onChange={(e) => setFlightNumber(e.target.value)}
                              placeholder="e.g. KQ-102"
                              className="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-lg text-xs placeholder-stone-400 focus:outline-none focus:border-stone-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                            Expected Arrival Time
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                            <input
                              id="input-pickup-arrival-time"
                              type="time"
                              value={pickupTime}
                              required={needsPickup}
                              onChange={(e) => setPickupTime(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary receipt box */}
                  <div className="p-4 bg-stone-900/95 text-stone-100 rounded-2xl flex flex-col gap-2 mt-5">
                    <p className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider font-mono">Invoice Invoice Detail</p>
                    
                    <div className="flex justify-between items-center text-xs text-stone-300">
                      <span>{selectedRoom.name} Stay ({nightsCount} night{nightsCount > 1 ? 's' : ''})</span>
                      <span className="font-mono">${stayCost}</span>
                    </div>

                    {needsPickup && (
                      <div className="flex justify-between items-center text-xs text-stone-300 pt-1">
                        <span>VIP Station Chauffeur Shuttle Placement</span>
                        <span className="font-mono text-emerald-400 font-semibold">+$25</span>
                      </div>
                    )}

                    <div className="h-px bg-stone-800/80 my-1"></div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-stone-200">Total Price Due:</span>
                      <span className="text-lg font-bold font-mono text-gold-200">${finalTotalAmount} USD</span>
                    </div>
                  </div>

                  {/* Submit validation badge */}
                  <button
                    id="btn-confirm-stay-booking"
                    type="submit"
                    className="w-full py-3.5 bg-stone-900 text-white hover:bg-gold-700 active:bg-gold-800 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-gold-600" />
                    CONFIRM & BOOK SECURELY
                  </button>
                  <p className="text-[10px] text-stone-500 text-center font-mono leading-tight">
                    *Instant real-time room locking activated. Room will be flagged as booked instantly upon submission.
                  </p>
                </div>
              )}
            </form>

          </div>
        )}
      </div>
    </div>
  );
}
