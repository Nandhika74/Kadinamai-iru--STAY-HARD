import React from 'react';
import { ShieldCheck, Calendar } from 'lucide-react';
import { formatDisplayDate } from '../utils/dateUtils';
import { PWAInstallButton } from './PWAInstallButton';
import { UserProfileBadge } from './UserProfileBadge';
import { SyncState } from '../hooks/useWorkoutProgress';

interface HeaderProps {
  currentTab: 'home' | 'plan' | 'workout' | 'progress';
  onNavigate: (tab: 'home' | 'plan' | 'workout' | 'progress') => void;
  onOpenSafety: () => void;
  onOpenAuthModal: () => void;
  syncState: SyncState;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSafety,
  onOpenAuthModal,
  syncState,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#DCD6F7]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single line, display face) */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7663B8] to-[#F8C8DC] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            K
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-base sm:text-lg text-[#30283D] tracking-tight">
              Kadinamai iru
            </span>
            <span className="text-xs font-bold text-[#7663B8] tracking-wider uppercase hidden sm:inline">
              #STAY HARD
            </span>
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links (Clean text links, single-line, no capsules) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#30283D]/70">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#7663B8] relative py-1 ${
              currentTab === 'home' ? 'text-[#7663B8] font-bold' : ''
            }`}
          >
            Home
            {currentTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7663B8] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onNavigate('plan')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#7663B8] relative py-1 ${
              currentTab === 'plan' ? 'text-[#7663B8] font-bold' : ''
            }`}
          >
            Weekly Plan
            {currentTab === 'plan' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7663B8] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onNavigate('workout')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#7663B8] relative py-1 ${
              currentTab === 'workout' ? 'text-[#7663B8] font-bold' : ''
            }`}
          >
            Workout
            {currentTab === 'workout' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7663B8] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#7663B8] relative py-1 ${
              currentTab === 'progress' ? 'text-[#7663B8] font-bold' : ''
            }`}
          >
            Progress
            {currentTab === 'progress' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7663B8] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Date */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <UserProfileBadge onOpenAuthModal={onOpenAuthModal} syncState={syncState} />
          <PWAInstallButton />

          <button
            onClick={onOpenSafety}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#7663B8] bg-[#FCE7F0]/70 hover:bg-[#FCE7F0] border border-[#F8C8DC] rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95"
            title="Read fitness safety tips"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Safety Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
