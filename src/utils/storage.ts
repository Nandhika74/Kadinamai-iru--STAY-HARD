export const STORAGE_KEY = 'kadinama-stay-hard-v1';

export interface WorkoutCompletionRecord {
  date: string; // YYYY-MM-DD
  workoutId: string;
  dayName: string;
  durationMinutes: number;
  completedAt: string; // ISO string
}

export interface StoredAppData {
  version: string;
  currentWeek: number; // 1, 2, 3, or 4
  completions: WorkoutCompletionRecord[];
  // Checklists keyed by `${date}_${workoutId}` -> list of checked exercise IDs
  checklists: Record<string, string[]>;
  // User daily notes keyed by `${date}`
  dailyNotes: Record<string, string>;
  preferences: {
    soundEffects: boolean;
    autoAdvanceRest: boolean;
  };
}

export const INITIAL_STORAGE_DATA: StoredAppData = {
  version: '1.0.0',
  currentWeek: 1,
  completions: [],
  checklists: {},
  dailyNotes: {},
  preferences: {
    soundEffects: true,
    autoAdvanceRest: false,
  },
};

/**
 * Safely loads application state from localStorage with fallback handling.
 */
export function loadAppData(): StoredAppData {
  if (typeof window === 'undefined') {
    return INITIAL_STORAGE_DATA;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STORAGE_DATA;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        ...INITIAL_STORAGE_DATA,
        ...parsed,
        completions: Array.isArray(parsed.completions) ? parsed.completions : [],
        checklists: typeof parsed.checklists === 'object' && parsed.checklists !== null ? parsed.checklists : {},
        dailyNotes: typeof parsed.dailyNotes === 'object' && parsed.dailyNotes !== null ? parsed.dailyNotes : {},
        preferences: {
          ...INITIAL_STORAGE_DATA.preferences,
          ...(parsed.preferences || {}),
        },
      };
    }
  } catch (err) {
    console.error('Error loading stored workout progress, falling back to defaults:', err);
  }
  return INITIAL_STORAGE_DATA;
}

/**
 * Safely persists application state to localStorage.
 */
export function saveAppData(data: StoredAppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save workout data to localStorage:', err);
  }
}

/**
 * Clears stored workout progress with a fresh initial state.
 */
export function resetStoredAppData(): StoredAppData {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  }
  return INITIAL_STORAGE_DATA;
}
