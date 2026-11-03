import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandling';

export interface FirestoreUserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  currentWeek: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreWorkoutRecord {
  id: string; // formatted as ${date}_${workoutId}
  userId: string;
  date: string; // YYYY-MM-DD
  workoutId: string;
  dayName: string;
  checkedExerciseIds: string[];
  completed: boolean;
  durationMinutes: number;
  notes?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch or initialize the user's profile document in /users/{userId}
 */
export async function getOrCreateUserProfile(
  userId: string,
  email: string,
  displayName?: string,
  photoURL?: string
): Promise<FirestoreUserProfile> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      return snap.data() as FirestoreUserProfile;
    }

    const newProfile: FirestoreUserProfile = {
      id: userId,
      email,
      displayName: displayName || '',
      photoURL: photoURL || '',
      currentWeek: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(userDocRef, newProfile);
    return newProfile;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Update current programme week or settings in /users/{userId}
 */
export async function updateProgrammeWeek(
  userId: string,
  week: number
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        currentWeek: week,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Listen to real-time changes to the user's profile
 */
export function subscribeToUserProfile(
  userId: string,
  callback: (profile: FirestoreUserProfile | null) => void
): () => void {
  const path = `users/${userId}`;
  const userDocRef = doc(db, 'users', userId);

  return onSnapshot(
    userDocRef,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as FirestoreUserProfile);
      } else {
        callback(null);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

/**
 * Save or update a daily workout record in /users/{userId}/workoutRecords/{recordId}
 */
export async function saveWorkoutRecord(
  userId: string,
  record: FirestoreWorkoutRecord
): Promise<void> {
  const recordId = record.id;
  const path = `users/${userId}/workoutRecords/${recordId}`;
  try {
    const recordRef = doc(db, 'users', userId, 'workoutRecords', recordId);
    const now = new Date().toISOString();

    const dataToSave: FirestoreWorkoutRecord = {
      ...record,
      userId,
      createdAt: record.createdAt || now,
      updatedAt: now,
    };

    await setDoc(recordRef, dataToSave, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Retrieve all workout records for the user from Cloud Firestore
 */
export async function fetchUserWorkoutRecords(
  userId: string
): Promise<FirestoreWorkoutRecord[]> {
  const path = `users/${userId}/workoutRecords`;
  try {
    const colRef = collection(db, 'users', userId, 'workoutRecords');
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as FirestoreWorkoutRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Real-time listener on user's workout records for live laptop <-> phone sync
 */
export function subscribeToWorkoutRecords(
  userId: string,
  callback: (records: FirestoreWorkoutRecord[]) => void
): () => void {
  const path = `users/${userId}/workoutRecords`;
  const colRef = collection(db, 'users', userId, 'workoutRecords');

  return onSnapshot(
    colRef,
    (snap) => {
      const records = snap.docs.map((d) => d.data() as FirestoreWorkoutRecord);
      callback(records);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

/**
 * Clear all records for a user (used during confirmed reset)
 */
export async function deleteAllUserWorkoutRecords(userId: string): Promise<void> {
  const path = `users/${userId}/workoutRecords`;
  try {
    const colRef = collection(db, 'users', userId, 'workoutRecords');
    const snap = await getDocs(colRef);
    const batch = writeBatch(db);

    snap.docs.forEach((d) => {
      batch.delete(d.ref);
    });

    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
