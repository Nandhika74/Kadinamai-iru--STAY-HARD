import React from 'react';
import { ShieldAlert, X, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';

interface SafetyDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyDisclaimerModal: React.FC<SafetyDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#DCD6F7]/60 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#FCE7F0] via-[#F8C8DC]/50 to-[#DCD6F7]/60 p-6 pb-5 border-b border-[#DCD6F7]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#7663B8]">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#30283D] tracking-tight">
                  Health & Movement Guidance
                </h3>
                <p className="text-xs text-[#7663B8] font-medium">
                  Your safety and wellbeing come first
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-[#30283D] rounded-full hover:bg-white/60 transition-colors"
              aria-label="Close safety guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm text-[#30283D]/90 leading-relaxed">
          <div className="p-3.5 bg-[#FFF9FC] rounded-2xl border border-[#F8C8DC]/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#7663B8] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-[#30283D]">
              <strong className="font-semibold block text-[#7663B8] mb-0.5">General Fitness Tool, Not Medical Care</strong>
              This application is designed as an encouraging habit-builder and movement guide for beginners. It does not provide medical diagnoses, physical therapy, or healthcare treatment.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#7663B8] uppercase tracking-wider">
              Essential Guidelines For Home Exercise
            </h4>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
                <span>
                  <strong>Start at your comfortable pace:</strong> If an exercise feels too difficult, use the provided beginner modifications (such as wall push-ups or chair squats).
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
                <span>
                  <strong>When to stop immediately:</strong> Discontinue exercising and consult a medical professional if you experience sharp or stabbing joint pain, chest pressure, dizziness, nausea, or unusual shortness of breath.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
                <span>
                  <strong>Warm up & cool down:</strong> Always take 2–3 minutes to wake up joints and cool down after each routine to prevent strains and support recovery.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
                <span>
                  <strong>Rest is productive:</strong> Never exercise through acute illness or injury. Sunday is built with an optional full rest day—honoring recovery is an essential part of getting stronger.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
                <span>
                  <strong>Evidence-based mindset:</strong> Exercise builds cardiovascular endurance, functional strength, posture, and joy. Spot reduction (losing fat in one isolated body part) is biologically impossible; focus on consistent whole-body movement and sustainable nutrition.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#7663B8] hover:bg-[#6452A3] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
