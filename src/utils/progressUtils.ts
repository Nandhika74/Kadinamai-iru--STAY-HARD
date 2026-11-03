import { WorkoutCompletionRecord } from './storage';
import { getCurrentWeekDates, getTodayDateString } from './dateUtils';

export interface ProgressStats {
  totalWorkouts: number;
  workoutsThisWeek: number;
  weeklyPercentage: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  weekDayStatus: Record<string, boolean>; // e.g. { '2026-11-02': true, ... }
}

/**
 * Calculates accurate streak and completion analytics from saved records.
 */
export function calculateProgressStats(completions: WorkoutCompletionRecord[]): ProgressStats {
  const totalWorkouts = completions.length;

  // Calculate total workout minutes
  const totalMinutes = completions.reduce((acc, curr) => acc + (curr.durationMinutes || 15), 0);

  // Set of completed dates (unique)
  const completedDateSet = new Set(completions.map((c) => c.date));

  // Current week statistics
  const currentWeekDays = getCurrentWeekDates();
  let workoutsThisWeek = 0;
  const weekDayStatus: Record<string, boolean> = {};

  for (const day of currentWeekDays) {
    const isCompleted = completedDateSet.has(day.date);
    weekDayStatus[day.date] = isCompleted;
    if (isCompleted) {
      workoutsThisWeek++;
    }
  }

  // 7 workout opportunities in a weekly plan
  const weeklyPercentage = Math.min(100, Math.round((workoutsThisWeek / 7) * 100));

  // Calculate Streaks based on calendar dates
  const todayStr = getTodayDateString();
  const sortedDates = Array.from(completedDateSet).sort();

  let longestStreak = 0;
  let currentStreak = 0;

  if (sortedDates.length > 0) {
    // Calculate Longest Streak
    let tempStreak = 0;
    let prevDate: Date | null = null;

    for (const dStr of sortedDates) {
      const [y, m, d] = dStr.split('-').map(Number);
      const currDate = new Date(y, m - 1, d);

      if (prevDate) {
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevDate = currDate;
    }

    // Calculate Current Streak
    // If today is completed, streak ends today.
    // If today is NOT completed, check if yesterday was completed.
    const [tY, tM, tD] = todayStr.split('-').map(Number);
    const today = new Date(tY, tM - 1, tD);

    const checkDate = new Date(today);
    if (!completedDateSet.has(todayStr)) {
      // Check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count backwards day by day
    while (true) {
      const y = checkDate.getFullYear();
      const m = String(checkDate.getMonth() + 1).padStart(2, '0');
      const d = String(checkDate.getDate()).padStart(2, '0');
      const checkStr = `${y}-${m}-${d}`;

      if (completedDateSet.has(checkStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    totalWorkouts,
    workoutsThisWeek,
    weeklyPercentage,
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalMinutes,
    weekDayStatus,
  };
}
