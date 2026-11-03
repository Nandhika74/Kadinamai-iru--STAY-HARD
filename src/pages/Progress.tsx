import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Clock,
  Zap,
  CheckCircle2,
  BookOpen,
  Trash2,
  AlertTriangle,
  Save,
  Check,
  Sparkles,
} from 'lucide-react';
import { ProgressStats } from '../utils/progressUtils';
import { getCurrentWeekDates, getTodayDateString, formatDisplayDate } from '../utils/dateUtils';
import { FOUR_WEEK_PROGRAMME_INFO } from '../data/workouts';
import { SyncState } from '../hooks/useWorkoutProgress';
import { User } from 'firebase/auth';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

interface ProgressPageProps {
  stats: ProgressStats;
  currentWeek: number;
  dailyNotes: Record<string, string>;
  syncState: SyncState;
  user: User | null;
  onOpenAuthModal: () => void;
  onSaveNote: (date: string, note: string) => void;
  onResetAllData: () => void;
}

export const Progress: React.FC<ProgressPageProps> = ({
  stats,
  currentWeek,
  dailyNotes,
  syncState,
  user,
  onOpenAuthModal,
  onSaveNote,
  onResetAllData,
}) => {
  const todayStr = getTodayDateString();
  const [noteInput, setNoteInput] = useState(dailyNotes[todayStr] || '');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const currentWeekDates = getCurrentWeekDates();

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(todayStr, noteInput);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2000);
  };

  const handleConfirmReset = () => {
    onResetAllData();
    setShowResetModal(false);
    setNoteInput('');
  };

  const weekInfo = FOUR_WEEK_PROGRAMME_INFO[currentWeek as 1 | 2 | 3 | 4] || FOUR_WEEK_PROGRAMME_INFO[1];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7663B8] tracking-wider uppercase mb-1">
            <TrendingUp className="w-4 h-4 text-[#7663B8]" />
            <span>Habit Tracking &amp; Growth</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#30283D] tracking-tight">
            Your Progress &amp; Streaks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real data calculated from your completed sessions. Track your consistency, celebrate milestones, and journal your journey.
          </p>
        </div>

        {/* Reset Progress Action */}
        <button
          onClick={() => setShowResetModal(true)}
          className="self-start sm:self-auto min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5"
          title="Clear local workout records"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset All Progress</span>
        </button>
      </div>

      {/* Primary KPI Grid (6 key metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* KPI 1: Total Completed Workouts */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FCE7F0] flex items-center justify-center text-[#7663B8]">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">All Time</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
            {stats.totalWorkouts}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Total Workouts Completed</p>
        </div>

        {/* KPI 2: Completed This Week */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#DCD6F7]/50 flex items-center justify-center text-[#7663B8]">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-[#7663B8] font-bold">Week {currentWeek}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
            {stats.workoutsThisWeek} <span className="text-xs text-slate-400 font-sans font-normal">/ 7</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Workouts This Week</p>
        </div>

        {/* KPI 3: Weekly Completion % */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF9FC] border border-[#F8C8DC] flex items-center justify-center text-[#7663B8]">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Target 100%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
            {stats.weeklyPercentage}%
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Weekly Completion Rate</p>
        </div>

        {/* KPI 4: Current Streak */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <Flame className="w-4 h-4 fill-rose-500" />
            </div>
            <span className="text-[11px] text-rose-600 font-bold">Active</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
            {stats.currentStreak} <span className="text-xs text-slate-400 font-sans font-normal">days</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Current Daily Streak</p>
        </div>

        {/* KPI 5: Longest Streak */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-amber-700 font-bold">Best Record</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
            {stats.longestStreak} <span className="text-xs text-slate-400 font-sans font-normal">days</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Longest Workout Streak</p>
        </div>

        {/* KPI 6: Total Workout Minutes */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Estimated</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
            {stats.totalMinutes} <span className="text-xs text-slate-400 font-sans font-normal">mins</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Total Dedicated Time</p>
        </div>
      </div>

      {/* 7-Day Current Week Calendar Overview */}
      <section className="bg-white rounded-3xl p-6 border border-[#DCD6F7]/60 shadow-[0_4px_25px_rgba(118,99,184,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#30283D] tracking-tight">
              This Week’s Consistency Calendar
            </h2>
            <p className="text-xs text-slate-500">
              Monday through Sunday activity breakdown
            </p>
          </div>
          <span className="text-xs font-bold text-[#7663B8] tabular-nums">
            {stats.workoutsThisWeek} / 7 active
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {currentWeekDates.map((day) => {
            const isCompleted = !!stats.weekDayStatus[day.date];
            const isToday = day.date === todayStr;

            return (
              <div
                key={day.date}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-between min-h-[90px] ${
                  isCompleted
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                    : isToday
                    ? 'bg-[#FCE7F0]/60 border-[#7663B8] ring-1 ring-[#7663B8]'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {day.dayName.substring(0, 3)}
                </span>

                <div className="my-1">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-xs font-mono font-medium text-slate-400">
                      —
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-medium text-slate-500">
                  {day.date.substring(5)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Reflection Journal & Workout Notes */}
      <section className="bg-white rounded-3xl p-6 border border-[#DCD6F7]/60 shadow-[0_4px_25px_rgba(118,99,184,0.04)] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FCE7F0] flex items-center justify-center text-[#7663B8]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#30283D] tracking-tight">
              Daily Movement Reflection
            </h2>
            <p className="text-xs text-slate-500">
              Journal your thoughts for {formatDisplayDate(todayStr)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveNote} className="space-y-3">
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="How did your body feel today? Which exercises felt energizing? Any modifications you enjoyed?"
            className="w-full min-h-[90px] p-3.5 rounded-2xl bg-[#FFF9FC] border border-[#DCD6F7]/70 text-xs sm:text-sm text-[#30283D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7663B8]/30 transition-all resize-y"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Notes are securely saved to your browser&apos;s local storage.
            </span>

            <button
              type="submit"
              className="min-h-[40px] px-5 py-2 rounded-xl bg-[#7663B8] hover:bg-[#6452A3] text-white text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95 shadow-xs"
            >
              {noteSavedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Recent Past Notes */}
        {Object.keys(dailyNotes).length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Recent Reflection Log
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {Object.entries(dailyNotes)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 5)
                .map(([dStr, note]) => (
                  <div key={dStr} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-[#7663B8] block">{formatDisplayDate(dStr)}</span>
                    <p className="text-slate-600 leading-relaxed">{note}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* Confirmation Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-rose-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#30283D]">Reset All Progress?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will clear your completion records, checked exercises, and streak count in this browser. This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="min-h-[44px] py-2 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="min-h-[44px] py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
