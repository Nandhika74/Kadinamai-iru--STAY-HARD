import React from 'react';
import {
  Play,
  CheckCircle,
  Clock,
  ArrowRight,
  Flame,
  Music2,
  Shield,
  Compass,
  Smile,
  ExternalLink,
} from 'lucide-react';
import { WorkoutDay, WorkoutCategory } from '../data/workouts';

interface WorkoutCardProps {
  workout: WorkoutDay;
  isCompleted: boolean;
  isToday?: boolean;
  onSelectWorkout: (workoutId: string) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  isCompleted,
  isToday = false,
  onSelectWorkout,
}) => {
  const getCategoryIcon = (category: WorkoutCategory) => {
    switch (category) {
      case 'strength':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'dance':
        return <Music2 className="w-4 h-4 text-purple-600" />;
      case 'core':
        return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'mobility':
        return <Compass className="w-4 h-4 text-teal-600" />;
      case 'recovery':
        return <Smile className="w-4 h-4 text-amber-500" />;
      default:
        return <Flame className="w-4 h-4 text-[#7663B8]" />;
    }
  };

  return (
    <div
      className={`relative bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
        isToday
          ? 'border-[#7663B8] shadow-[0_8px_25px_rgba(118,99,184,0.12)] ring-2 ring-[#7663B8]/20'
          : 'border-[#DCD6F7]/60 hover:border-[#7663B8]/40 shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Meta Strip: Day, Today tag, Category, Completion status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#7663B8] tracking-wide uppercase">
              {workout.dayName}
            </span>
            {isToday && (
              <span className="bg-[#FCE7F0] text-[#7663B8] font-bold text-[10px] px-2 py-0.5 rounded-full border border-[#F8C8DC]">
                Today
              </span>
            )}
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              {getCategoryIcon(workout.category)}
              <span>{workout.categoryLabel}</span>
            </div>
          </div>

          {/* Completion Indicator */}
          {isCompleted ? (
            <div
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
              title="Workout completed on record"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Done</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{workout.estimatedDuration}</span>
            </div>
          )}
        </div>

        {/* Title & Objective */}
        <h3 className="text-base sm:text-lg font-bold text-[#30283D] tracking-tight mb-1.5">
          {workout.title}
        </h3>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {workout.objective}
        </p>

        {/* Exercise preview counts & video indicator */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-5 pt-3 border-t border-slate-100">
          <span>{workout.exercises.length} Exercises</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{workout.channelName} Video</span>
        </div>
      </div>

      {/* Action Buttons: View Workout & Watch Workout (Kept separate and functional) */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* View Workout in App */}
        <button
          type="button"
          onClick={() => onSelectWorkout(workout.id)}
          className="min-h-[44px] px-3 py-2 rounded-xl bg-[#FFF9FC] hover:bg-[#FCE7F0] border border-[#DCD6F7] text-xs font-bold text-[#7663B8] flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <span>View Routine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Watch on YouTube (External safe link) */}
        <a
          href={workout.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-red-50 border border-red-200 text-xs font-bold text-[#E62117] flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          title={`Watch ${workout.videoTitle} on YouTube`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Watch Video</span>
          <ExternalLink className="w-3 h-3 text-red-400" />
        </a>
      </div>
    </div>
  );
};
