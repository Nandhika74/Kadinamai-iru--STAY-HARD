import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { SafetyDisclaimerModal } from './components/SafetyDisclaimerModal';
import { AuthModal } from './components/AuthModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Home } from './pages/Home';
import { Plan } from './pages/Plan';
import { Workout } from './pages/Workout';
import { Progress } from './pages/Progress';
import { useWorkoutProgress } from './hooks/useWorkoutProgress';
import { getCurrentDayWorkoutId, getTodayDateString } from './utils/dateUtils';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<'home' | 'plan' | 'workout' | 'progress'>('home');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(() => getCurrentDayWorkoutId());
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { user } = useAuth();
  const {
    currentWeek,
    stats,
    syncState,
    dailyNotes,
    toggleExerciseCheck,
    resetChecklist,
    isWorkoutCompleted,
    markWorkoutComplete,
    unmarkWorkoutComplete,
    getCheckedExercises,
    setProgrammeWeek,
    saveDailyNote,
    resetAllProgress,
  } = useWorkoutProgress();

  const todayStr = getTodayDateString();
  const todayWorkoutId = getCurrentDayWorkoutId();
  const isTodayCompleted = isWorkoutCompleted(todayWorkoutId, todayStr);

  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setCurrentTab('workout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: 'home' | 'plan' | 'workout' | 'progress') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF9FC] flex flex-col text-[#30283D] selection:bg-[#F8C8DC] selection:text-[#30283D]">
      {/* Top Bar Header with User Profile Badge & PWA Install */}
      <Header
        currentTab={currentTab}
        onNavigate={handleTabChange}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        syncState={syncState}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12">
        {currentTab === 'home' && (
          <Home
            stats={stats}
            isTodayWorkoutCompleted={isTodayCompleted}
            onSelectWorkout={handleSelectWorkout}
            onNavigateToTab={handleTabChange}
            user={user}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'plan' && (
          <Plan
            currentWeek={currentWeek}
            stats={stats}
            onSetWeek={setProgrammeWeek}
            onSelectWorkout={handleSelectWorkout}
          />
        )}

        {currentTab === 'workout' && (
          <Workout
            selectedWorkoutId={selectedWorkoutId}
            currentWeek={currentWeek}
            onSelectWorkoutId={setSelectedWorkoutId}
            isCompleted={isWorkoutCompleted(selectedWorkoutId, todayStr)}
            checkedIds={getCheckedExercises(selectedWorkoutId, todayStr)}
            onToggleExercise={(exId) => toggleExerciseCheck(selectedWorkoutId, exId, todayStr)}
            onResetChecklist={() => resetChecklist(selectedWorkoutId, todayStr)}
            onMarkComplete={(wId, dayName, duration) =>
              markWorkoutComplete(wId, dayName, duration, todayStr)
            }
            onUnmarkComplete={(wId) => unmarkWorkoutComplete(wId, todayStr)}
            onOpenSafety={() => setIsSafetyOpen(true)}
          />
        )}

        {currentTab === 'progress' && (
          <Progress
            stats={stats}
            currentWeek={currentWeek}
            dailyNotes={dailyNotes}
            syncState={syncState}
            user={user}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSaveNote={saveDailyNote}
            onResetAllData={resetAllProgress}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNavigation
        currentTab={currentTab}
        onSelectTab={handleTabChange}
      />

      {/* Safety & Movement Guidance Modal */}
      <SafetyDisclaimerModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

      {/* Google Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
