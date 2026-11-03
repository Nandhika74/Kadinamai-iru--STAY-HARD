import React, { useState } from 'react';
import {
  Play,
  ArrowRight,
  Sparkles,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  Dumbbell,
  RefreshCw,
  Award,
  Zap,
  Heart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { WORKOUT_DAYS, WorkoutDay } from '../data/workouts';
import { MOTIVATIONAL_QUOTES } from '../data/motivationalQuotes';
import { formatDisplayDate, getCurrentDayWorkoutId, getCurrentWeekDates } from '../utils/dateUtils';
import { ProgressStats } from '../utils/progressUtils';
import { WorkoutCard } from '../components/WorkoutCard';
import { PWAInstallBanner } from '../components/PWAInstallBanner';

import { User } from 'firebase/auth';

interface HomePageProps {
  stats: ProgressStats;
  isTodayWorkoutCompleted: boolean;
  onSelectWorkout: (workoutId: string) => void;
  onNavigateToTab: (tab: 'home' | 'plan' | 'workout' | 'progress') => void;
  user: User | null;
  onOpenAuthModal: () => void;
}

export const Home: React.FC<HomePageProps> = ({
  stats,
  isTodayWorkoutCompleted,
  onSelectWorkout,
  onNavigateToTab,
  user,
  onOpenAuthModal,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const todayWorkoutId = getCurrentDayWorkoutId();
  const todayWorkout: WorkoutDay =
    WORKOUT_DAYS.find((w) => w.id === todayWorkoutId) || WORKOUT_DAYS[0];

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentWeekDates = getCurrentWeekDates();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Mobile-Friendly PWA Download Banner */}
      <PWAInstallBanner />

      {/* Cloud Sync Callout for Unauthenticated Users */}
      {!user && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCD6F7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FCE7F0] text-[#7663B8] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#30283D]">
                Sync Your Workouts Between Laptop &amp; Phone
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Sign in with Google to protect your daily workout streaks and access live progress across all devices.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-xl bg-[#7663B8] hover:bg-[#6452A3] text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            Sign in with Google
          </button>
        </div>
      )}

      {/* Hero Welcome Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FCE7F0] via-[#FFF9FC] to-[#DCD6F7]/60 border border-[#DCD6F7]/60 shadow-[0_8px_30px_rgba(118,99,184,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7663B8] tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-[#7663B8]" />
                <span>Kadinamai iru · #STAY HARD</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500 font-medium">{formatDisplayDate()}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#30283D] tracking-tight leading-tight">
                Small steps. <span className="text-[#7663B8]">Stronger you.</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Welcome back to your daily movement sanctuary. No weights, no intimidation—just genuine habit building, strong legs, energized core, and joyful dance cardio.
              </p>
            </div>

            {/* Quick Motivational Quote Bar */}
            <div className="mt-5 p-3.5 bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F8C8DC] flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-[#7663B8] fill-[#FCE7F0] shrink-0" />
                <p className="text-xs sm:text-sm italic text-[#30283D] font-medium">
                  &ldquo;{currentQuote.quote}&rdquo;
                </p>
              </div>
              <button
                onClick={handleNextQuote}
                className="p-1.5 text-slate-400 hover:text-[#7663B8] rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                title="Next motivation reminder"
                aria-label="Rotate quote"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hero Image Side Banner */}
          <div className="hidden lg:block lg:col-span-5 relative min-h-[220px]">
            <img
              src="/src/assets/images/fitness_hero_banner_1793734243442.jpg"
              alt="Peaceful home workout space with blush pink mat and gentle daylight"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FCE7F0]/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Today's Workout Feature Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#7663B8]/30 shadow-[0_8px_30px_rgba(118,99,184,0.08)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7663B8] bg-[#FCE7F0] px-3 py-1 rounded-full border border-[#F8C8DC]">
                Today&apos;s Scheduled Workout · {todayWorkout.dayName}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {todayWorkout.categoryLabel}
              </span>
              {isTodayWorkoutCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed Today!
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold text-[#30283D] tracking-tight">
              {todayWorkout.title}
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              {todayWorkout.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#7663B8]" />
                <span>{todayWorkout.estimatedDuration}</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#7663B8]" />
                <span>{todayWorkout.exercises.length} Exercises (Zero Equipment)</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 sm:min-w-[240px]">
            {/* Start Workout Button */}
            <button
              onClick={() => onSelectWorkout(todayWorkout.id)}
              className="min-h-[50px] px-6 py-3 rounded-2xl bg-[#7663B8] hover:bg-[#6452A3] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#7663B8]/20 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <span>{isTodayWorkoutCompleted ? 'Review Routine' : 'Start Today’s Workout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Watch Workout on YouTube Button */}
            <a
              href={todayWorkout.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[50px] px-6 py-3 rounded-2xl bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400 text-sm font-bold text-[#E62117] flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.98]"
            >
              <div className="w-5 h-5 rounded-md bg-[#E62117] text-white flex items-center justify-center">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Progress Summary KPIs (Calculated from saved completion records) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#30283D] tracking-tight">
            Your Habit Momentum
          </h2>
          <button
            onClick={() => onNavigateToTab('progress')}
            className="text-xs font-semibold text-[#7663B8] hover:underline flex items-center gap-1"
          >
            <span>View Full Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Workouts Completed This Week */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#FCE7F0] flex items-center justify-center text-[#7663B8] mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
              {stats.workoutsThisWeek} <span className="text-xs text-slate-400 font-sans font-normal">/ 7</span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">This Week’s Workouts</p>
          </div>

          {/* Card 2: Weekly Completion Percentage */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#FFF9FC] border border-[#F8C8DC] flex items-center justify-center text-[#7663B8] mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
              {stats.weeklyPercentage}%
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">Weekly Consistency</p>
          </div>

          {/* Card 3: Current Workout Streak */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#FCE7F0] flex items-center justify-center text-rose-500 mb-3">
              <Flame className="w-4 h-4 fill-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
              {stats.currentStreak} <span className="text-xs text-slate-400 font-sans font-normal">{stats.currentStreak === 1 ? 'day' : 'days'}</span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">Current Active Streak</p>
          </div>

          {/* Card 4: Total Completed Workouts */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCD6F7]/60 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#DCD6F7]/40 flex items-center justify-center text-[#7663B8] mb-3">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#30283D] font-mono tabular-nums">
              {stats.totalWorkouts}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">Total Completed Sessions</p>
          </div>
        </div>
      </section>

      {/* Weekly Workout Preview Grid (7 Days) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-lg font-bold text-[#30283D] tracking-tight">
              7-Day Weekly Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Balanced structure: Legs &amp; Glutes, Dance Cardio, Upper Body, Hip Mobility &amp; Active Recovery.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('plan')}
            className="text-xs font-semibold text-[#7663B8] hover:underline self-start sm:self-auto"
          >
            Explore 4-Week Plan &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {WORKOUT_DAYS.map((workout) => {
            // Find corresponding date in current week
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
      </section>
    </div>
  );
};
