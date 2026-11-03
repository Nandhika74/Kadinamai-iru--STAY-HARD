/**
 * Date utilities for local calendar tracking and streak management.
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentDayWorkoutId(): string {
  const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const map: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };
  return map[dayIndex] || 'monday';
}

export function formatDisplayDate(dateStr?: string): string {
  let date: Date;
  if (dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date();
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns an array of 7 date strings (YYYY-MM-DD) for Monday -> Sunday
 * of the week containing the specified or current date.
 */
export function getCurrentWeekDates(refDate: Date = new Date()): { date: string; dayName: string; dayIndex: number }[] {
  const current = new Date(refDate);
  const day = current.getDay();
  // We want Monday (1) to be day 0 of our week array, and Sunday (0) to be day 6
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  const days: { date: string; dayName: string; dayIndex: number }[] = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayIndices = [1, 2, 3, 4, 5, 6, 0];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(d.getDate()).padStart(2, '0');
    days.push({
      date: `${year}-${month}-${dayOfMonth}`,
      dayName: dayNames[i],
      dayIndex: dayIndices[i],
    });
  }

  return days;
}

export function isSameDay(dateStr1: string, dateStr2: string): boolean {
  return dateStr1 === dateStr2;
}
