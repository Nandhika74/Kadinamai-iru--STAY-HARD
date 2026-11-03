import React from 'react';
import { X, Sparkles, Shield, Smartphone, Laptop, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, loading, error, clearError } = useAuth();

  if (!isOpen) return null;

  const handleSignIn = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-[#DCD6F7] shadow-2xl space-y-5 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7663B8] to-[#F8C8DC] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              K
            </div>
            <div>
              <span className="text-xs font-bold text-[#7663B8] uppercase tracking-wider block">
                Kadinamai iru · Cloud Account
              </span>
              <h3 className="text-lg font-extrabold text-[#30283D] tracking-tight">
                Sign in with Google
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="p-4 bg-gradient-to-r from-[#FFF9FC] to-[#FCE7F0]/50 rounded-2xl border border-[#F8C8DC] space-y-2.5 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Multi-Device Sync:</strong> Check off a workout on your mobile phone and view it on your laptop in real time.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Cloud Firestore Backup:</strong> Your streaks, workout duration, and reflections are securely protected in the cloud.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Zero Password Burden:</strong> Instant secure 1-click Google Sign-In with isolated private records.
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-[#7663B8] text-sm font-bold text-[#30283D] flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#7663B8]" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-normal">
            By signing in, your workout records and streaks are stored safely in your private Firestore database.
          </p>
        </div>
      </div>
    </div>
  );
};
