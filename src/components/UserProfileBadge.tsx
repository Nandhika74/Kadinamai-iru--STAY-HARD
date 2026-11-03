import React, { useState, useRef, useEffect } from 'react';
import { LogIn, LogOut, Cloud, CloudOff, RefreshCw, User as UserIcon, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SyncState } from '../hooks/useWorkoutProgress';

interface UserProfileBadgeProps {
  onOpenAuthModal: () => void;
  syncState: SyncState;
}

export const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({ onOpenAuthModal, syncState }) => {
  const { user, signOutUser, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse border border-slate-200" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={onOpenAuthModal}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#7663B8] bg-[#FCE7F0]/80 hover:bg-[#FCE7F0] border border-[#F8C8DC] rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
        title="Sign in with Google to sync across phone and laptop"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </button>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'Fitness Habit';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl bg-white hover:bg-slate-50 border border-[#DCD6F7]/80 transition-all shadow-xs active:scale-95 text-left"
        aria-label="User account menu"
      >
        {/* Avatar or Initial */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            className="w-7 h-7 rounded-xl object-cover border border-[#DCD6F7]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7663B8] to-[#F8C8DC] text-white flex items-center justify-center text-xs font-black shadow-xs">
            {initial}
          </div>
        )}

        {/* Name and sync dot */}
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-bold text-[#30283D] max-w-[100px] truncate leading-tight">
            {displayName}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Synced</span>
          </div>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Account Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl p-4 border border-[#DCD6F7] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-10 h-10 rounded-2xl object-cover border border-[#DCD6F7]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#7663B8] text-white flex items-center justify-center text-sm font-black">
                {initial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#30283D] block truncate">
                {displayName}
              </span>
              <span className="text-[11px] text-slate-400 block truncate">
                {user.email}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#FFF9FC] rounded-2xl border border-[#F8C8DC] space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#7663B8]">
              <Cloud className="w-3.5 h-3.5 text-emerald-500" />
              <span>Multi-Device Sync Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Progress, streaks, and checklists synchronize live between your laptop and phone.
            </p>
          </div>

          <button
            onClick={() => {
              setDropdownOpen(false);
              signOutUser();
            }}
            className="w-full py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
