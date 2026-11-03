import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already running standalone on phone home screen, suppress banner
  if (isInstalled || isDismissed) {
    return null;
  }

  // Handle direct install for Chromium / Android / Desktop
  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#FCE7F0] via-[#FFF9FC] to-[#DCD6F7]/60 rounded-3xl p-4 sm:p-5 border-2 border-[#F8C8DC] shadow-[0_4px_20px_rgba(118,99,184,0.06)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#7663B8] text-white flex items-center justify-center shadow-sm shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7663B8] bg-white px-2 py-0.5 rounded-full border border-[#DCD6F7]">
                  Install to Phone
                </span>
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                  Zero App Store Hassle
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#30283D] mt-0.5 tracking-tight">
                Download &ldquo;Kadinamai iru&rdquo; as a Native Mobile App
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Add to your home screen for 1-tap quick workouts, offline tracking, and a clean full-screen experience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={handleInstallClick}
              className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#7663B8] hover:bg-[#6452A3] text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-[#7663B8]/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>{isIOS ? 'Install on iPhone' : 'Download App'}</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/60 transition-colors"
              title="Dismiss banner"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guided Installation Modal (for iOS Safari and manual instructions) */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-[#DCD6F7] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FCE7F0] flex items-center justify-center text-[#7663B8]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#30283D]">
                  Install on Your Phone
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <p className="font-medium text-[#30283D]">
                To install this app on your iPhone, iPad, or Android browser:
              </p>

              <div className="p-3 bg-[#FFF9FC] rounded-2xl border border-[#F8C8DC] space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#7663B8] shrink-0 font-bold">
                    1
                  </div>
                  <div className="leading-relaxed">
                    Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-[#7663B8]" /> at the bottom or top of your browser.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#7663B8] shrink-0 font-bold">
                    2
                  </div>
                  <div className="leading-relaxed">
                    Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-[#7663B8]" />.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#7663B8] shrink-0 font-bold">
                    3
                  </div>
                  <div className="leading-relaxed">
                    Tap <strong>Add</strong> in the top-right corner. The app icon will appear right on your home screen!
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No app store account or download size required.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#7663B8] hover:bg-[#6452A3] text-white text-xs font-bold transition-colors shadow-xs"
            >
              Got It, Let&apos;s Workout!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
