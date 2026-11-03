import React from 'react';
import { Home, CalendarDays, Dumbbell, TrendingUp } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: 'home' | 'plan' | 'workout' | 'progress';
  onSelectTab: (tab: 'home' | 'plan' | 'workout' | 'progress') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan', label: 'Plan', icon: CalendarDays },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ] as const;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#DCD6F7]/60 shadow-[0_-4px_16px_rgba(118,99,184,0.06)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isActive ? 'text-[#7663B8]' : 'text-[#30283D]/60 hover:text-[#30283D]'
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#FCE7F0] scale-110' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
