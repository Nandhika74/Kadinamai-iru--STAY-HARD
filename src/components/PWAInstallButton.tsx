import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Hide if already running as installed app
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#7663B8] hover:bg-[#6452A3] rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
        title="Install Kadinamai iru to your phone"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Guided installation popup */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-[#DCD6F7] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FCE7F0] flex items-center justify-center text-[#7663B8]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#30283D]">
                  Install on Mobile Phone
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
                Install as a native full-screen app on your phone:
              </p>

              <div className="p-3 bg-[#FFF9FC] rounded-2xl border border-[#F8C8DC] space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#7663B8] shrink-0 font-bold">
                    1
                  </div>
                  <div className="leading-relaxed">
                    Tap the <strong>Share</strong> icon <Share className="w-3.5 h-3.5 inline mx-0.5 text-[#7663B8]" /> on iOS Safari, or browser menu (⋮) on Chrome.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#7663B8] shrink-0 font-bold">
                    2
                  </div>
                  <div className="leading-relaxed">
                    Select <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-[#7663B8]" />.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#7663B8] shrink-0 font-bold">
                    3
                  </div>
                  <div className="leading-relaxed">
                    Tap <strong>Add</strong>. Launch directly from your home screen anytime without browser toolbars!
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Works offline and syncs with backend database automatically.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#7663B8] hover:bg-[#6452A3] text-white text-xs font-bold transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
