import { Hotel, UserCheck, Shield, ClipboardList, Briefcase } from 'lucide-react';

interface HeaderProps {
  isOwnerView: boolean;
  setIsOwnerView: (val: boolean) => void;
  activeBookingsCount: number;
}

export default function Header({ isOwnerView, setIsOwnerView, activeBookingsCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100/80 px-4 md:px-8 py-4 shadow-soft">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-stone-900 text-gold-100 rounded-xl shadow-md">
            <Hotel className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
              Havenwood Estates
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-gold-600 uppercase font-semibold">
              Boutique Alpine & Safari Escapes
            </p>
          </div>
        </div>

        {/* Dynamic Controls / Roster / Switch */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Active Bookings Summary Pill */}
          {!isOwnerView && activeBookingsCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-50 border border-gold-200 text-gold-700 rounded-full text-xs font-medium font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-gold-600"></span>
              {activeBookingsCount} BOOKED {activeBookingsCount === 1 ? 'STAY' : 'STAYS'}
            </div>
          )}

          {/* Mode Switch Button */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/50">
            <button
              id="btn-guest-mode"
              onClick={() => setIsOwnerView(false)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
                !isOwnerView
                  ? 'bg-white text-stone-900 shadow-sm font-bold'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              GUEST PORTAL
            </button>
            <button
              id="btn-owner-mode"
              onClick={() => setIsOwnerView(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
                isOwnerView
                  ? 'bg-stone-900 text-gold-100 shadow-md font-bold'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              OWNER CONSOLE
            </button>
          </div>

          {/* User Signpost */}
          <div className="hidden lg:flex items-center gap-2 border-l border-stone-200 pl-4">
            <div className="text-right">
              <p className="text-xs font-medium text-stone-800">M. Wamuru</p>
              <p className="text-[9px] font-mono text-stone-400">Portfolio Owner</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold text-xs select-none shadow-inner">
              MW
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
