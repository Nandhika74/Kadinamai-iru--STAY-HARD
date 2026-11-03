import React, { useState } from 'react';
import {
  Check,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Timer,
  Undo2,
} from 'lucide-react';
import { Exercise } from '../data/workouts';
import { ProgressBar } from './ProgressBar';
import { RestTimer } from './RestTimer';

interface ExerciseChecklistProps {
  workoutId: string;
  dayName: string;
  durationMinutes: number;
  exercises: Exercise[];
  currentWeek: number; // 1 | 2 | 3 | 4
  checkedIds: string[];
  isCompleted: boolean;
  onToggleExercise: (exerciseId: string) => void;
  onResetChecklist: () => void;
  onMarkComplete: () => void;
  onUnmarkComplete: () => void;
}

export const ExerciseChecklist: React.FC<ExerciseChecklistProps> = ({
  workoutId,
  dayName,
  durationMinutes,
  exercises,
  currentWeek,
  checkedIds,
  isCompleted,
  onToggleExercise,
  onResetChecklist,
  onMarkComplete,
  onUnmarkComplete,
}) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);

  const completedCount = checkedIds.length;
  const totalCount = exercises.length;
  const allChecked = totalCount > 0 && completedCount === totalCount;

  const toggleExpand = (id: string) => {
    setExpandedExerciseId((prev) => (prev === id ? null : id));
  };

  const handleStartRestTimer = (seconds: number) => {
    setActiveTimerSeconds(seconds);
    // Smooth scroll down to timer if needed
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCD6F7]/60 shadow-[0_4px_20px_rgba(118,99,184,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#30283D] tracking-tight">
              Interactive Exercise Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Week {currentWeek} progression targets. Check off exercises as you finish each movement.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {completedCount > 0 && (
              <button
                onClick={onResetChecklist}
                className="text-xs font-semibold text-slate-500 hover:text-[#30283D] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Reset checked exercises for today"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Checklist</span>
              </button>
            )}
          </div>
        </div>

        <ProgressBar
          completed={completedCount}
          total={totalCount}
          label="Session Completion"
        />

        {/* Subtle celebratory message when all are checked */}
        {allChecked && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FCE7F0] via-[#F8C8DC]/40 to-[#DCD6F7]/50 border border-[#F8C8DC] flex items-center gap-3 animate-in fade-in duration-300">
            <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#7663B8] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs text-[#30283D] leading-relaxed">
              <strong className="font-bold block text-[#7663B8]">Outstanding effort!</strong>
              You completed all exercises for today. Click &quot;Mark Workout Complete&quot; below to record your streak!
            </div>
          </div>
        )}
      </div>

      {/* Embedded Rest Timer (if activated) */}
      {activeTimerSeconds !== null && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-[#7663B8]">Active Rest Interval</span>
            <button
              onClick={() => setActiveTimerSeconds(null)}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Close Timer
            </button>
          </div>
          <RestTimer initialSeconds={activeTimerSeconds} />
        </div>
      )}

      {/* Exercise Items List */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => {
          const isChecked = checkedIds.includes(exercise.id);
          const isExpanded = expandedExerciseId === exercise.id;
          const weekTarget =
            exercise.weekTargets[currentWeek as 1 | 2 | 3 | 4] ||
            exercise.weekTargets[1];

          return (
            <div
              key={exercise.id}
              className={`bg-white rounded-2xl border transition-all duration-200 ${
                isChecked
                  ? 'border-[#DCD6F7] bg-[#FFF9FC]/70'
                  : 'border-[#DCD6F7]/60 hover:border-[#7663B8]/40 shadow-sm'
              }`}
            >
              <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                {/* Custom Accessible Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleExercise(exercise.id)}
                  className={`min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 -mt-1 rounded-xl transition-all ${
                    isChecked
                      ? 'text-white'
                      : 'text-slate-300 hover:text-[#7663B8]'
                  }`}
                  aria-label={`Mark ${exercise.name} as ${isChecked ? 'incomplete' : 'complete'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-[#7663B8] border-[#7663B8] shadow-sm'
                        : 'border-slate-300 bg-white hover:border-[#7663B8]'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-[#7663B8] font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4
                        className={`text-sm sm:text-base font-bold tracking-tight ${
                          isChecked ? 'line-through text-slate-400' : 'text-[#30283D]'
                        }`}
                      >
                        {exercise.name}
                      </h4>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {exercise.targetMuscle}
                      </span>
                    </div>

                    {/* Week target badge */}
                    <div className="flex items-center gap-2 mt-1 sm:mt-0">
                      <div className="text-xs font-semibold text-[#7663B8] bg-[#FCE7F0]/80 px-2.5 py-1 rounded-lg">
                        {weekTarget.sets} sets × {weekTarget.repsOrDuration}
                      </div>
                    </div>
                  </div>

                  {/* Short instructions preview */}
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {exercise.instructions}
                  </p>

                  {/* Expand / Details accordion toggle */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/80">
                    <button
                      onClick={() => toggleExpand(exercise.id)}
                      className="text-xs font-semibold text-[#7663B8] hover:text-[#6452A3] flex items-center gap-1 min-h-[36px]"
                    >
                      <span>{isExpanded ? 'Hide Details & Modification' : 'Form Tips & Modification'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {weekTarget.restSeconds > 0 && (
                      <button
                        onClick={() => handleStartRestTimer(weekTarget.restSeconds)}
                        className="text-xs font-medium text-slate-500 hover:text-[#7663B8] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Start timer for recommended rest"
                      >
                        <Timer className="w-3.5 h-3.5 text-[#7663B8]" />
                        <span>Rest {weekTarget.restSeconds}s</span>
                      </button>
                    )}
                  </div>

                  {/* Expanded instructions, beginner modification & form tip */}
                  {isExpanded && (
                    <div className="mt-3 p-3.5 bg-[#FFF9FC] rounded-2xl border border-[#DCD6F7]/50 space-y-2.5 text-xs animate-in fade-in duration-200">
                      <div className="flex items-start gap-2 text-slate-700">
                        <HelpCircle className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-[#7663B8] block">Beginner Modification:</strong>
                          <span>{exercise.beginnerModification}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-slate-700">
                        <Lightbulb className="w-4 h-4 text-[#7663B8] shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-[#7663B8] block">Form & Safety Note:</strong>
                          <span>{exercise.formTip}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Completion Action Area */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCD6F7]/60 shadow-[0_4px_20px_rgba(118,99,184,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#30283D]">
            {isCompleted ? 'Workout Marked Complete! 🎉' : 'Ready to record today’s session?'}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {isCompleted
              ? 'Your completion is saved in your local calendar and streak.'
              : 'You do not have to finish every exercise if you feel tired or need to stop.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isCompleted ? (
            <button
              onClick={onUnmarkComplete}
              className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <Undo2 className="w-4 h-4" />
              <span>Undo Completion</span>
            </button>
          ) : (
            <button
              onClick={onMarkComplete}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-2xl bg-[#7663B8] hover:bg-[#6452A3] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-md shadow-[#7663B8]/25 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Workout Complete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
