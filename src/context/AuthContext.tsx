import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (authError) => {
        console.error('Auth state change error:', authError);
        setError(authError.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (err: unknown) {
      console.error('Google Sign-In error:', err);
      const errorCode = typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code: unknown }).code)
        : '';

      switch (errorCode) {
        case 'auth/popup-closed-by-user':
          setError('Sign-in was cancelled. Please try again.');
          break;
        case 'auth/popup-blocked':
          setError('Your browser blocked the Google sign-in popup. Allow popups for this site and try again.');
          break;
        case 'auth/unauthorized-domain':
          setError('This site is not authorized for Firebase Authentication. Add its domain in Firebase Console under Authentication > Settings > Authorized domains.');
          break;
        case 'auth/operation-not-allowed':
          setError('Google sign-in is not enabled for this Firebase project. Enable it under Firebase Console > Authentication > Sign-in method.');
          break;
        default:
          setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err: unknown) {
      console.error('Sign-out error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signOutUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
