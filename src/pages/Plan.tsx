import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  Flame,
  Music2,
  Compass,
  Smile,
  Info,
  CheckCircle,
} from 'lucide-react';
import { WORKOUT_DAYS, FOUR_WEEK_PROGRAMME_INFO, WorkoutCategory } from '../data/workouts';
import { WorkoutCard } from '../components/WorkoutCard';
import { getCurrentWeekDates, getCurrentDayWorkoutId } from '../utils/dateUtils';
import { ProgressStats } from '../utils/progressUtils';

interface PlanPageProps {
  currentWeek: number;
  stats: ProgressStats;
  onSetWeek: (week: number) => void;
  onSelectWorkout: (workoutId: string) => void;
}

export const Plan: React.FC<PlanPageProps> = ({
  currentWeek,
  stats,
  onSetWeek,
  onSelectWorkout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | WorkoutCategory>('all');

  const currentWeekDates = getCurrentWeekDates();
  const todayWorkoutId = getCurrentDayWorkoutId();

  const filteredWorkouts = WORKOUT_DAYS.filter((w) => {
    if (selectedCategory === 'all') return true;
    return w.category === selectedCategory;
  });

  const weekInfo = FOUR_WEEK_PROGRAMME_INFO[currentWeek as 1 | 2 | 3 | 4] || FOUR_WEEK_PROGRAMME_INFO[1];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7663B8] tracking-wider uppercase mb-1">
            <CalendarDays className="w-4 h-4 text-[#7663B8]" />
            <span>Structured Habit Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#30283D] tracking-tight">
            Weekly Workout Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            A balanced 7-day home blueprint engineered for beginners: alternating muscle activation, joyous dance cardio, posture stabilization, and restorative mobility.
          </p>
        </div>

        {/* Quick stat pill */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#DCD6F7]/60 shadow-xs flex items-center gap-3 self-start sm:self-auto">
          <div className="w-8 h-8 rounded-xl bg-[#FCE7F0] flex items-center justify-center text-[#7663B8]">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#30283D] block">{stats.workoutsThisWeek} of 7 Completed</span>
            <span className="text-slate-500">This current week</span>
          </div>
        </div>
      </div>

      {/* 4-Week Progressive Programme Stage Selector */}
      <section className="bg-gradient-to-r from-[#FFF9FC] via-white to-[#FCE7F0]/40 rounded-3xl p-6 border border-[#DCD6F7]/60 shadow-[0_4px_25px_rgba(118,99,184,0.05)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7663B8] text-white flex items-center justify-center text-xs font-black">
              4W
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#30283D]">
                4-Week Progressive Journey
              </h2>
              <p className="text-xs text-slate-500">
                Current Level: <strong className="text-[#7663B8]">Week {currentWeek} — {weekInfo.title}</strong>
              </p>
            </div>
          </div>

          {/* Week Selector Segmented Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FCE7F0]/60 rounded-2xl border border-[#F8C8DC]">
            {[1, 2, 3, 4].map((wk) => (
              <button
                key={wk}
                onClick={() => onSetWeek(wk)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  currentWeek === wk
                    ? 'bg-[#7663B8] text-white shadow-sm scale-102'
                    : 'text-[#30283D]/70 hover:text-[#7663B8] hover:bg-white/60'
                }`}
              >
                Week {wk}
              </button>
            ))}
          </div>
        </div>

        {/* Current Week Description Box */}
        <div className="p-4 bg-white rounded-2xl border border-[#DCD6F7]/40 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <strong className="font-semibold text-[#30283D] block mb-0.5">
              Week {currentWeek} Focus: {weekInfo.focus}
            </strong>
            {weekInfo.description} Exercise volume and rest recommendations in the Workout view automatically adapt to this week!
          </div>
        </div>
      </section>

      {/* Category Filter Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 mr-1 whitespace-nowrap shrink-0">Filter:</span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#7663B8] text-white'
              : 'bg-white border border-[#DCD6F7]/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All 7 Days
        </button>
        <button
          onClick={() => setSelectedCategory('strength')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            selectedCategory === 'strength'
              ? 'bg-[#7663B8] text-white'
              : 'bg-white border border-[#DCD6F7]/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Strength &amp; Legs</span>
        </button>
        <button
          onClick={() => setSelectedCategory('dance')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            selectedCategory === 'dance'
              ? 'bg-[#7663B8] text-white'
              : 'bg-white border border-[#DCD6F7]/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Music2 className="w-3.5 h-3.5 text-purple-600" />
          <span>Dance &amp; Zumba</span>
        </button>
        <button
          onClick={() => setSelectedCategory('mobility')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            selectedCategory === 'mobility'
              ? 'bg-[#7663B8] text-white'
              : 'bg-white border border-[#DCD6F7]/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-teal-600" />
          <span>Hip Mobility</span>
        </button>
        <button
          onClick={() => setSelectedCategory('recovery')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            selectedCategory === 'recovery'
              ? 'bg-[#7663B8] text-white'
              : 'bg-white border border-[#DCD6F7]/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Smile className="w-3.5 h-3.5 text-amber-500" />
          <span>Recovery &amp; Rest</span>
        </button>
      </div>

      {/* Seven Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredWorkouts.map((workout) => {
          const dayEntry = currentWeekDates.find((d) => d.dayName === workout.dayName);
          const isCompleted = dayEntry ? !!stats.weekDayStatus[dayEntry.date] : false;
          const isToday = workout.id === todayWorkoutId;

          return (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              isCompleted={isCompleted}
              isToday={isToday}
              onSelectWorkout={onSelectWorkout}
            />
          );
        })}
      </div>

      {/* Gentle Encouragement Banner with Visual Asset */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FCE7F0] via-[#FFF9FC] to-[#DCD6F7]/50 border border-[#F8C8DC] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#7663B8] tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-[#7663B8]" />
              <span>Movement Should Feel Good</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#30283D]">
              Freedom to Adapt Any Routine to Your Body
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fitness is not a punishment. Whether you dance with full energy on Tuesday or choose a quiet 15-minute floor stretch on Sunday, you are building self-trust and sustainable physical health.
            </p>
          </div>

          <div className="md:col-span-4 rounded-2xl overflow-hidden shadow-sm aspect-video md:aspect-4/3 max-h-40 w-full">
            <img
              src="/src/assets/images/workout_dance_cardio_1793734244394.jpg"
              alt="Woman smiling happily during beginner home dance workout"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
