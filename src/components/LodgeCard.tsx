import React from 'react';
import { MapPin, Star, Sparkles, BedDouble } from 'lucide-react';
import { Lodge } from '../types';

interface LodgeCardProps {
  lodge: Lodge;
  onExploreRooms: (lodge: Lodge) => void;
  availableRoomsCount: number;
}

export default function LodgeCard({ lodge, onExploreRooms, availableRoomsCount }: LodgeCardProps): React.JSX.Element {
  return (
    <div 
      id={`lodge-card-${lodge.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/60 hover:border-stone-300 transition-all duration-300 shadow-soft hover:shadow-premium flex flex-col h-full"
    >
      {/* Decorative Image Banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
        <img 
          src={lodge.image} 
          alt={lodge.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Rating Floating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm shadow-sm rounded-lg text-xs font-semibold text-stone-900 border border-stone-100">
          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
          <span>{lodge.rating}</span>
        </div>

        {/* Featured Amenity overlay */}
        <div className="absolute bottom-4 left-4 bg-stone-900/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 text-[11px] font-medium tracking-wide text-amber-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 fill-amber-200/20" />
          {lodge.featuredAmenity}
        </div>
      </div>

      {/* Lodge Profile Details */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Location Row */}
        <div className="flex items-center gap-1 text-xs text-stone-400 font-medium mb-1.5 uppercase font-mono tracking-widest">
          <MapPin className="w-3 h-3 text-stone-400" />
          <span>{lodge.location}</span>
        </div>

        {/* Dynamic Name */}
        <h3 className="font-serif text-xl font-bold tracking-tight text-stone-900 group-hover:text-gold-700 transition-colors duration-300">
          {lodge.name}
        </h3>

        {/* Story Text */}
        <p className="text-stone-500 text-xs leading-relaxed mt-2.5 line-clamp-3">
          {lodge.description}
        </p>

        {/* Dividers & Statistics */}
        <div className="mt-auto pt-5 border-t border-stone-100/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold font-mono">Rates Starting At</p>
            <p className="text-[17px] font-bold font-mono text-stone-900">
              ${lodge.basePrice}
              <span className="text-xs font-medium text-stone-400 font-sans"> / night</span>
            </p>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
              availableRoomsCount > 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              <BedDouble className="w-3.5 h-3.5" />
              {availableRoomsCount > 0 
                ? `${availableRoomsCount} Vacanc${availableRoomsCount === 1 ? 'y' : 'ies'}` 
                : 'Fully Booked'}
            </span>
          </div>
        </div>

        {/* Click CTA */}
        <button
          id={`btn-explore-${lodge.id}`}
          onClick={() => onExploreRooms(lodge)}
          className="mt-4 w-full py-2.5 bg-stone-900 hover:bg-gold-700 active:bg-gold-800 text-white font-semibold text-xs tracking-wider rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        >
          SELECT EXPERIENCE ROOMS
        </button>
      </div>
    </div>
  );
}
