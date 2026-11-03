import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  saveWorkoutRecord,
  subscribeToWorkoutRecords,
  subscribeToUserProfile,
  updateProgrammeWeek,
  getOrCreateUserProfile,
  deleteAllUserWorkoutRecords,
  FirestoreWorkoutRecord,
} from '../services/firestoreService';
import {
  StoredAppData,
  loadAppData,
  saveAppData,
  resetStoredAppData,
  WorkoutCompletionRecord,
} from '../utils/storage';
import { getTodayDateString } from '../utils/dateUtils';
import { calculateProgressStats, ProgressStats } from '../utils/progressUtils';

export type SyncState = 'synced' | 'syncing' | 'offline' | 'local';

export function useWorkoutProgress() {
  const { user } = useAuth();
  const [localData, setLocalData] = useState<StoredAppData>(() => loadAppData());
  const [firestoreRecords, setFirestoreRecords] = useState<FirestoreWorkoutRecord[]>([]);
  const [cloudWeek, setCloudWeek] = useState<number | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('local');
  const hasMergedLocalRef = useRef(false);

  // 1. When Authenticated: Set up real-time Cloud Firestore listeners
  useEffect(() => {
    if (!user) {
      setSyncState('local');
      hasMergedLocalRef.current = false;
      return;
    }

    setSyncState('syncing');

    // Initialize or get UserProfile
    getOrCreateUserProfile(user.uid, user.email || '', user.displayName || '', user.photoURL || '')
      .then((profile) => {
        if (profile?.currentWeek) {
          setCloudWeek(profile.currentWeek);
        }
      })
      .catch((err) => console.error('Failed to get/create user profile:', err));

    // Subscribe to User Profile
    const unsubProfile = subscribeToUserProfile(user.uid, (profile) => {
      if (profile?.currentWeek) {
        setCloudWeek(profile.currentWeek);
      }
    });

    // Subscribe to Workout Records (Real-time multi-device sync)
    const unsubRecords = subscribeToWorkoutRecords(user.uid, (records) => {
      setFirestoreRecords(records);
      setSyncState('synced');

      // On first sign in: If there were local workout records not yet in Firestore, merge them up to cloud!
      if (!hasMergedLocalRef.current && localData.completions.length > 0) {
        hasMergedLocalRef.current = true;
        const existingKeys = new Set(records.map((r) => r.id));

        localData.completions.forEach(async (c) => {
          const recordId = `${c.date}_${c.workoutId}`;
          if (!existingKeys.has(recordId)) {
            const checklist = localData.checklists[recordId] || [];
            const note = localData.dailyNotes[c.date] || '';
            await saveWorkoutRecord(user.uid, {
              id: recordId,
              userId: user.uid,
              date: c.date,
              workoutId: c.workoutId,
              dayName: c.dayName,
              checkedExerciseIds: checklist,
              completed: true,
              durationMinutes: c.durationMinutes || 15,
              notes: note,
              completedAt: c.completedAt,
            }).catch((e) => console.warn('Could not auto-migrate record:', e));
          }
        });
      }
    });

    return () => {
      unsubProfile();
      unsubRecords();
    };
  }, [user]);

  // Current active programme week (Cloud takes priority if signed in)
  const currentWeek = useMemo(() => {
    if (user && cloudWeek !== null) return cloudWeek;
    return localData.currentWeek || 1;
  }, [user, cloudWeek, localData.currentWeek]);

  // Normalized completions list derived from Cloud Firestore if authenticated, or localData if not
  const activeCompletions: WorkoutCompletionRecord[] = useMemo(() => {
    if (user) {
      return firestoreRecords
        .filter((r) => r.completed)
        .map((r) => ({
          date: r.date,
          workoutId: r.workoutId,
          dayName: r.dayName,
          durationMinutes: r.durationMinutes || 15,
          completedAt: r.completedAt || r.updatedAt || new Date().toISOString(),
        }))
        .sort((a, b) => b.date.localeCompare(a.date));
    }
    return localData.completions;
  }, [user, firestoreRecords, localData.completions]);

  // Real-time calculated statistics
  const stats: ProgressStats = useMemo(() => {
    return calculateProgressStats(activeCompletions);
  }, [activeCompletions]);

  // Combined daily notes dictionary
  const activeDailyNotes: Record<string, string> = useMemo(() => {
    if (user) {
      const notesMap: Record<string, string> = {};
      firestoreRecords.forEach((r) => {
        if (r.notes && r.notes.trim()) {
          notesMap[r.date] = r.notes;
        }
      });
      return notesMap;
    }
    return localData.dailyNotes;
  }, [user, firestoreRecords, localData.dailyNotes]);

  /**
   * Toggle a specific exercise in today's (or given date's) checklist
   */
  const toggleExerciseCheck = useCallback(
    async (
      workoutId: string,
      exerciseId: string,
      dateStr: string = getTodayDateString(),
      dayName: string = 'Workout'
    ) => {
      const recordId = `${dateStr}_${workoutId}`;

      if (user) {
        setSyncState('syncing');
        const existingRecord = firestoreRecords.find((r) => r.id === recordId);
        const currentList = existingRecord?.checkedExerciseIds || [];
        const isAlreadyChecked = currentList.includes(exerciseId);
        const nextList = isAlreadyChecked
          ? currentList.filter((id) => id !== exerciseId)
          : [...currentList, exerciseId];

        const updated: FirestoreWorkoutRecord = {
          id: recordId,
          userId: user.uid,
          date: dateStr,
          workoutId,
          dayName: existingRecord?.dayName || dayName,
          checkedExerciseIds: nextList,
          completed: existingRecord?.completed || false,
          durationMinutes: existingRecord?.durationMinutes || 15,
          notes: existingRecord?.notes || '',
        };

        try {
          await saveWorkoutRecord(user.uid, updated);
          setSyncState('synced');
        } catch (err) {
          console.error('Failed to sync checklist to Firestore:', err);
          setSyncState('offline');
        }
      } else {
        // Unauthenticated local storage mode
        setLocalData((prev) => {
          const currentList = prev.checklists[recordId] || [];
          const isAlreadyChecked = currentList.includes(exerciseId);
          const nextList = isAlreadyChecked
            ? currentList.filter((id) => id !== exerciseId)
            : [...currentList, exerciseId];

          const updated = {
            ...prev,
            checklists: {
              ...prev.checklists,
              [recordId]: nextList,
            },
          };
          saveAppData(updated);
          return updated;
        });
      }
    },
    [user, firestoreRecords]
  );

  /**
   * Reset checklist for a specific workout on a specific date
   */
  const resetChecklist = useCallback(
    async (workoutId: string, dateStr: string = getTodayDateString()) => {
      const recordId = `${dateStr}_${workoutId}`;

      if (user) {
        setSyncState('syncing');
        const existingRecord = firestoreRecords.find((r) => r.id === recordId);
        if (existingRecord) {
          const updated: FirestoreWorkoutRecord = {
            ...existingRecord,
            checkedExerciseIds: [],
          };
          try {
            await saveWorkoutRecord(user.uid, updated);
            setSyncState('synced');
          } catch (err) {
            console.error('Failed to reset checklist on Firestore:', err);
          }
        }
      } else {
        setLocalData((prev) => {
          const updatedChecklists = { ...prev.checklists };
          delete updatedChecklists[recordId];
          const updated = { ...prev, checklists: updatedChecklists };
          saveAppData(updated);
          return updated;
        });
      }
    },
    [user, firestoreRecords]
  );

  /**
   * Checks whether a workout is recorded as complete for a specific date
   */
  const isWorkoutCompleted = useCallback(
    (workoutId: string, dateStr: string = getTodayDateString()): boolean => {
      if (user) {
        const recordId = `${dateStr}_${workoutId}`;
        const match = firestoreRecords.find((r) => r.id === recordId);
        return !!match?.completed;
      }
      return localData.completions.some(
        (c) => c.date === dateStr && c.workoutId === workoutId
      );
    },
    [user, firestoreRecords, localData.completions]
  );

  /**
   * Explicitly mark workout complete
   */
  const markWorkoutComplete = useCallback(
    async (
      workoutId: string,
      dayName: string,
      durationMinutes: number,
      dateStr: string = getTodayDateString()
    ) => {
      const recordId = `${dateStr}_${workoutId}`;

      if (user) {
        setSyncState('syncing');
        const existingRecord = firestoreRecords.find((r) => r.id === recordId);
        const updated: FirestoreWorkoutRecord = {
          id: recordId,
          userId: user.uid,
          date: dateStr,
          workoutId,
          dayName,
          checkedExerciseIds: existingRecord?.checkedExerciseIds || [],
          completed: true,
          durationMinutes,
          notes: existingRecord?.notes || '',
          completedAt: new Date().toISOString(),
        };

        try {
          await saveWorkoutRecord(user.uid, updated);
          setSyncState('synced');
        } catch (err) {
          console.error('Failed to save completion to Cloud Firestore:', err);
          setSyncState('offline');
        }
      } else {
        setLocalData((prev) => {
          const exists = prev.completions.some(
            (c) => c.date === dateStr && c.workoutId === workoutId
          );
          if (exists) return prev;

          const newRecord: WorkoutCompletionRecord = {
            date: dateStr,
            workoutId,
            dayName,
            durationMinutes,
            completedAt: new Date().toISOString(),
          };

          const updated = {
            ...prev,
            completions: [newRecord, ...prev.completions],
          };
          saveAppData(updated);
          return updated;
        });
      }
    },
    [user, firestoreRecords]
  );

  /**
   * Unmark a workout (toggle off if marked by mistake)
   */
  const unmarkWorkoutComplete = useCallback(
    async (workoutId: string, dateStr: string = getTodayDateString()) => {
      const recordId = `${dateStr}_${workoutId}`;

      if (user) {
        setSyncState('syncing');
        const existingRecord = firestoreRecords.find((r) => r.id === recordId);
        if (existingRecord) {
          const updated: FirestoreWorkoutRecord = {
            ...existingRecord,
            completed: false,
          };
          try {
            await saveWorkoutRecord(user.uid, updated);
            setSyncState('synced');
          } catch (err) {
            console.error('Failed to unmark completion in Firestore:', err);
          }
        }
      } else {
        setLocalData((prev) => {
          const updated = {
            ...prev,
            completions: prev.completions.filter(
              (c) => !(c.date === dateStr && c.workoutId === workoutId)
            ),
          };
          saveAppData(updated);
          return updated;
        });
      }
    },
    [user, firestoreRecords]
  );

  /**
   * Retrieve list of checked exercise IDs
   */
  const getCheckedExercises = useCallback(
    (workoutId: string, dateStr: string = getTodayDateString()): string[] => {
      const recordId = `${dateStr}_${workoutId}`;
      if (user) {
        const match = firestoreRecords.find((r) => r.id === recordId);
        return match?.checkedExerciseIds || [];
      }
      return localData.checklists[recordId] || [];
    },
    [user, firestoreRecords, localData.checklists]
  );

  /**
   * Change four-week programme stage
   */
  const setProgrammeWeek = useCallback(
    async (week: number) => {
      const validatedWeek = Math.max(1, Math.min(4, week));
      if (user) {
        setCloudWeek(validatedWeek);
        await updateProgrammeWeek(user.uid, validatedWeek).catch((err) =>
          console.error('Failed to update programme week in Firestore:', err)
        );
      } else {
        setLocalData((prev) => {
          const updated = { ...prev, currentWeek: validatedWeek };
          saveAppData(updated);
          return updated;
        });
      }
    },
    [user]
  );

  /**
   * Save a daily reflection or exercise note
   */
  const saveDailyNote = useCallback(
    async (dateStr: string, note: string, workoutId: string = 'daily') => {
      if (user) {
        setSyncState('syncing');
        // Find or create record for today
        const recordId = `${dateStr}_${workoutId}`;
        const existingRecord = firestoreRecords.find((r) => r.id === recordId);

        const updated: FirestoreWorkoutRecord = {
          id: recordId,
          userId: user.uid,
          date: dateStr,
          workoutId,
          dayName: existingRecord?.dayName || 'Daily Reflection',
          checkedExerciseIds: existingRecord?.checkedExerciseIds || [],
          completed: existingRecord?.completed || false,
          durationMinutes: existingRecord?.durationMinutes || 0,
          notes: note,
        };

        try {
          await saveWorkoutRecord(user.uid, updated);
          setSyncState('synced');
        } catch (err) {
          console.error('Failed to save note to Firestore:', err);
        }
      } else {
        setLocalData((prev) => {
          const updated = {
            ...prev,
            dailyNotes: {
              ...prev.dailyNotes,
              [dateStr]: note,
            },
          };
          saveAppData(updated);
          return updated;
        });
      }
    },
    [user, firestoreRecords]
  );

  /**
   * Complete reset of all stored records
   */
  const resetAllProgress = useCallback(async () => {
    if (user) {
      await deleteAllUserWorkoutRecords(user.uid).catch((err) =>
        console.error('Failed to delete cloud records:', err)
      );
      setFirestoreRecords([]);
    }
    const fresh = resetStoredAppData();
    setLocalData(fresh);
    saveAppData(fresh);
  }, [user]);

  return {
    currentWeek,
    stats,
    syncState,
    dailyNotes: activeDailyNotes,
    toggleExerciseCheck,
    resetChecklist,
    isWorkoutCompleted,
    markWorkoutComplete,
    unmarkWorkoutComplete,
    getCheckedExercises,
    setProgrammeWeek,
    saveDailyNote,
    resetAllProgress,
  };
}
