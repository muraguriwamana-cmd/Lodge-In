import { Calendar, User, MapPin, Car, Trash2, Printer, CheckCircle, Clock } from 'lucide-react';
import { Booking } from '../types';

interface BookingListProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string, roomId: string) => void;
}

export default function BookingList({ bookings, onCancelBooking }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-2xl p-8 text-center max-w-lg mx-auto shadow-soft">
        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto mb-4">
          <Calendar className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h4 className="font-serif text-lg font-bold text-stone-900">
          No Registered Bookings
        </h4>
        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
          You haven't booked any rooms in this session yet. Explore our lodges menu below to book your next dream vacation!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Your Current Itineraries</h3>
          <p className="text-xs text-stone-500">Self-manage your stays and coordinate shuttle pickups instantly</p>
        </div>
        <span className="px-3 py-1 bg-stone-900 text-amber-200 text-xs font-mono font-bold rounded-lg px-2.5">
          {bookings.length} {bookings.length === 1 ? 'RESERVATION' : 'RESERVATIONS'}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            id={`booking-card-${booking.id}`}
            key={booking.id}
            className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-soft flex flex-col md:flex-row transition-all hover:border-stone-300"
          >
            {/* Left accent strip or mini overview */}
            <div className="p-5 md:w-[65%] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-gold-600 font-bold uppercase tracking-widest block">
                      Havenwood Escape Pass
                    </span>
                    <h4 className="font-serif text-lg font-bold text-stone-900 mt-1 lines-clamp-1">
                      {booking.lodgeName}
                    </h4>
                  </div>
                  <span className="bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0">
                    ID: {booking.id}
                  </span>
                </div>

                {/* Stay summary */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-stone-600 bg-stone-50/50 p-2.5 rounded-xl border border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 font-medium block">Room Accommodation</span>
                    <strong className="text-stone-800">{booking.roomName}</strong>
                    <span className="block text-[10px] text-stone-500">Suite #{booking.roomNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-medium block">Active Guest</span>
                    <strong className="text-stone-800">{booking.customerName}</strong>
                    <span className="block text-[10px] text-stone-500">Qty: {booking.guestsCount} {booking.guestsCount === 1 ? 'Adult' : 'Adults'}</span>
                  </div>
                </div>

                {/* Timeline Row */}
                <div className="flex items-center gap-4 mt-4 text-xs font-mono font-semibold text-stone-800 bg-stone-100/50 px-3 py-2 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In: {booking.checkInDate}</span>
                  </div>
                  <div className="text-stone-300">|</div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Out: {booking.checkOutDate}</span>
                  </div>
                </div>
              </div>

              {/* Guest Actions */}
              <div className="flex gap-2 mt-5 pt-3 border-t border-stone-100">
                <button
                  id={`btn-cancel-stay-${booking.id}`}
                  onClick={() => onCancelBooking(booking.id, booking.roomId)}
                  className="flex-grow flex items-center justify-center gap-1 py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  CANCEL STAY
                </button>
                <button
                  id={`btn-print-${booking.id}`}
                  onClick={() => alert(`Printing Stay Stub ${booking.id}... Passcode matching OK.`)}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center gap-1 shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  STUB
                </button>
              </div>
            </div>

            {/* Right side panel focusing heavily on VIP pickup information! */}
            <div className={`p-5 md:w-[35%] border-t md:border-t-0 md:border-l ${booking.needsPickup ? 'bg-gold-50/40 border-gold-100' : 'bg-stone-50/50 border-stone-100'} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center gap-1.5">
                  <Car className={`w-4 h-4 ${booking.needsPickup ? 'text-gold-700' : 'text-stone-400'}`} />
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${booking.needsPickup ? 'text-gold-800' : 'text-stone-500'}`}>
                    {booking.needsPickup ? 'SHUTTLE MATCHED' : 'SELF ARRIVAL'}
                  </span>
                </div>

                {booking.needsPickup ? (
                  <div className="mt-3.5 space-y-3">
                    <div>
                      <p className="text-[10px] text-stone-400 font-medium">Terminal Junction</p>
                      <p className="text-[11px] font-semibold text-stone-800 leading-tight">
                        {booking.pickupLocation}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-stone-400 font-medium">Transit Code</p>
                        <p className="text-[11px] font-bold font-mono text-stone-800">
                          {booking.pickupFlightNumber || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400 font-medium">Driver Time</p>
                        <p className="text-[11px] font-bold font-mono text-stone-800">
                          {booking.pickupTime}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-gold-700 leading-relaxed font-medium bg-gold-100/40 p-2 rounded-lg border border-gold-200/40">
                      Our chauffeur will hold a board coded: <strong className="text-stone-900 font-serif">"{booking.customerName.split(' ')[0]}"</strong>
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      You indicated that you do not require a private airport/station courier. 
                    </p>
                    <p className="text-[10px] text-stone-400 mt-2 font-mono">
                      Location navigation pins will be sent to <strong>{booking.customerEmail}</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Total cost display */}
              <div className="mt-6 pt-3 border-t border-stone-200/80-accent text-right">
                <span className="text-[10px] text-stone-400 font-medium block">Total Paid Invoice</span>
                <span className="text-base font-bold font-mono text-stone-900">${booking.totalCost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
