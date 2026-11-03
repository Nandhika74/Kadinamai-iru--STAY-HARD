import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, Volume2, VolumeX } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  onFinish?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ initialSeconds = 45, onFinish }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play gentle completion chime via Web Audio API synth
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523.25, 0, 0.25); // C5
      playTone(659.25, 0.15, 0.25); // E5
      playTone(783.99, 0.3, 0.4); // G5
    } catch {
      // AudioContext may be blocked if user has not interacted
    }
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      playChime();
      if (onFinish) onFinish();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsLeft, onFinish]);

  const toggleRun = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(initialSeconds);
    }
    setIsRunning(!isRunning);
  };

  const reset = (secs: number = initialSeconds) => {
    setIsRunning(false);
    setSecondsLeft(secs);
  };

  const addTime = (secs: number) => {
    setSecondsLeft((prev) => prev + secs);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#DCD6F7]/60 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7663B8] uppercase tracking-wider">
          <Timer className="w-4 h-4" />
          <span>Rest Interval Timer</span>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-slate-400 hover:text-[#7663B8] p-1 rounded-md transition-colors"
          title={soundEnabled ? 'Mute rest timer chime' : 'Enable rest timer chime'}
          aria-label="Toggle chime sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Countdown display */}
        <div className="text-3xl sm:text-4xl font-extrabold text-[#30283D] font-mono tabular-nums tracking-tight">
          {formatTime(secondsLeft)}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRun}
            className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              isRunning
                ? 'bg-[#FCE7F0] text-[#7663B8] hover:bg-[#F8C8DC]'
                : 'bg-[#7663B8] text-white hover:bg-[#6452A3]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{secondsLeft === 0 ? 'Restart' : 'Start'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => reset(initialSeconds)}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#30283D] hover:bg-slate-50 transition-colors flex items-center justify-center"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => addTime(15)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-[#DCD6F7] text-xs font-semibold text-[#7663B8] hover:bg-[#FFF9FC] transition-colors flex items-center gap-1"
            title="Add 15 seconds"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>15s</span>
          </button>
        </div>
      </div>

      {/* Preset intervals */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <span className="text-[11px] font-medium text-slate-400">Presets:</span>
        <button
          onClick={() => reset(30)}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
            secondsLeft === 30 && !isRunning ? 'bg-[#7663B8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          30s
        </button>
        <button
          onClick={() => reset(45)}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
            secondsLeft === 45 && !isRunning ? 'bg-[#7663B8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          45s
        </button>
        <button
          onClick={() => reset(60)}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
            secondsLeft === 60 && !isRunning ? 'bg-[#7663B8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          60s
        </button>
      </div>
    </div>
  );
};
