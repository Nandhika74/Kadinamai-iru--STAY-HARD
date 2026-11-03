import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  label = 'Workout Progress',
  showPercentage = true,
}) => {
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#30283D] tracking-tight">{label}</span>
        <div className="flex items-center gap-1.5 text-xs text-[#7663B8] font-bold tabular-nums">
          <span>{completed} of {total} completed</span>
          {showPercentage && <span>({percentage}%)</span>}
        </div>
      </div>

      <div className="w-full h-2.5 bg-[#FCE7F0] rounded-full overflow-hidden p-0.5 border border-[#F8C8DC]/60">
        <div
          className="h-full bg-gradient-to-r from-[#F8C8DC] via-[#DCD6F7] to-[#7663B8] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
