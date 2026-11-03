import React from 'react';
import {
  Calendar,
  Clock,
  Target,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { WORKOUT_DAYS, WorkoutDay } from '../data/workouts';
import { VideoSection } from '../components/VideoSection';
import { ExerciseChecklist } from '../components/ExerciseChecklist';
import { getTodayDateString, formatDisplayDate } from '../utils/dateUtils';

interface WorkoutPageProps {
  selectedWorkoutId: string;
  currentWeek: number;
  onSelectWorkoutId: (id: string) => void;
  isCompleted: boolean;
  checkedIds: string[];
  onToggleExercise: (exerciseId: string) => void;
  onResetChecklist: () => void;
  onMarkComplete: (workoutId: string, dayName: string, durationMinutes: number) => void;
  onUnmarkComplete: (workoutId: string) => void;
  onOpenSafety: () => void;
}

export const Workout: React.FC<WorkoutPageProps> = ({
  selectedWorkoutId,
  currentWeek,
  onSelectWorkoutId,
  isCompleted,
  checkedIds,
  onToggleExercise,
  onResetChecklist,
  onMarkComplete,
  onUnmarkComplete,
  onOpenSafety,
}) => {
  const currentWorkout: WorkoutDay =
    WORKOUT_DAYS.find((w) => w.id === selectedWorkoutId) || WORKOUT_DAYS[0];

  const currentIndex = WORKOUT_DAYS.findIndex((w) => w.id === currentWorkout.id);

  const handlePrevDay = () => {
    const nextIndex = (currentIndex - 1 + WORKOUT_DAYS.length) % WORKOUT_DAYS.length;
    onSelectWorkoutId(WORKOUT_DAYS[nextIndex].id);
  };

  const handleNextDay = () => {
    const nextIndex = (currentIndex + 1) % WORKOUT_DAYS.length;
    onSelectWorkoutId(WORKOUT_DAYS[nextIndex].id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Day Selector Pill Navigation */}
      <div className="bg-white rounded-3xl p-3 border border-[#DCD6F7]/60 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <button
          onClick={handlePrevDay}
          className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-[#7663B8] hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0"
          aria-label="Previous Day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-1">
          {WORKOUT_DAYS.map((w) => {
            const isSelected = w.id === currentWorkout.id;
            return (
              <button
                key={w.id}
                onClick={() => onSelectWorkoutId(w.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#7663B8] text-white shadow-sm scale-102'
                    : 'text-slate-600 hover:text-[#7663B8] hover:bg-[#FCE7F0]/40'
                }`}
              >
                {w.dayName}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextDay}
          className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-[#7663B8] hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0"
          aria-label="Next Day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Workout Header Overview */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCD6F7]/60 shadow-[0_4px_25px_rgba(118,99,184,0.05)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7663B8] bg-[#FCE7F0] px-3 py-1 rounded-full border border-[#F8C8DC]">
                {currentWorkout.dayName} · {currentWorkout.categoryLabel}
              </span>

              {isCompleted ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recorded Completed
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                  Ready to start
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#30283D] tracking-tight">
              {currentWorkout.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {currentWorkout.description}
            </p>

            {/* Objective Callout */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FFF9FC] border border-[#DCD6F7]/50 text-xs text-[#30283D]">
              <Target className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-[#7663B8]">Primary Objective: </strong>
                <span>{currentWorkout.objective}</span>
              </div>
            </div>

            {/* Warm-Up & Safety Info Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-700 block mb-0.5">Warm-Up (2–3 min):</span>
                <span className="text-slate-500">{currentWorkout.warmUpNotes}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-700 block mb-0.5">Cool-Down:</span>
                <span className="text-slate-500">{currentWorkout.coolDownNotes}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Aside */}
          <div className="bg-[#FFF9FC] p-5 rounded-2xl border border-[#DCD6F7]/60 md:min-w-[220px] space-y-3 self-stretch md:self-start">
            <div className="text-xs text-slate-500 font-medium">Session Snapshot</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Duration</span>
                <span className="font-bold text-[#30283D]">{currentWorkout.estimatedDuration}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Movements</span>
                <span className="font-bold text-[#30283D]">{currentWorkout.exercises.length}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Programme</span>
                <span className="font-bold text-[#7663B8]">Week {currentWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Equipment</span>
                <span className="font-bold text-emerald-600">None needed</span>
              </div>
            </div>

            <button
              onClick={onOpenSafety}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-white border border-[#DCD6F7] text-[11px] font-semibold text-[#7663B8] hover:bg-[#FCE7F0]/40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Read Safety Tips</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mandatory YouTube Follow-Along Video Section */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#7663B8] uppercase tracking-wider">
            Step 1 · Follow-Along Video
          </span>
          <span className="text-xs text-slate-400">
            Targeted for {currentWorkout.dayName}
          </span>
        </div>
        <VideoSection workout={currentWorkout} />
      </section>

      {/* Step 2: Interactive Exercise Checklist */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#7663B8] uppercase tracking-wider">
            Step 2 · Exercise Checklist &amp; Progression
          </span>
          <span className="text-xs text-slate-400">
            Check each as you finish
          </span>
        </div>

        <ExerciseChecklist
          workoutId={currentWorkout.id}
          dayName={currentWorkout.dayName}
          durationMinutes={currentWorkout.durationMinutes}
          exercises={currentWorkout.exercises}
          currentWeek={currentWeek}
          checkedIds={checkedIds}
          isCompleted={isCompleted}
          onToggleExercise={onToggleExercise}
          onResetChecklist={onResetChecklist}
          onMarkComplete={() =>
            onMarkComplete(currentWorkout.id, currentWorkout.dayName, currentWorkout.durationMinutes)
          }
          onUnmarkComplete={() => onUnmarkComplete(currentWorkout.id)}
        />
      </section>
    </div>
  );
};
