import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 max-w-sm mx-auto bg-[#30283D] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-4 duration-300">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
      <span className="flex-1 font-medium">
        Offline Mode — You can still exercise &amp; track progress! Changes will sync when reconnected.
      </span>
    </div>
  );
};
