import { useState, useEffect, useRef } from 'react';
import { Timer } from './components/Timer';
import { PresetButtons } from './components/PresetButtons';
import { ControlButtons } from './components/ControlButtons';
import { AutomationSection } from './components/AutomationSection';
import { TimePicker } from './components/TimePicker';
import { CompletionModal } from './components/CompletionModal';
import { ResumeSessionDialog } from './components/ResumeSessionDialog';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { StatusBar } from './components/StatusBar';
import { useReducedMotion } from './components/hooks/useReducedMotion';
import { haptics } from './utils/haptics';
import { Moon, Sun, TimerIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner@2.0.3';

interface TimerState {
  time: number;
  initialTime: number;
  isRunning: boolean;
  isPaused: boolean;
  timestamp: number;
}

export default function App() {
  const [time, setTime] = useState(0); // in seconds
  const [initialTime, setInitialTime] = useState(0); // for progress calculation
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDndActive, setIsDndActive] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedSession, setSavedSession] = useState<TimerState | null>(null);
  const intervalRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Check for saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem('monofocus_session');
    if (saved) {
      try {
        const session: TimerState = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - session.timestamp) / 1000);
        const timeRemaining = Math.max(0, session.time - elapsed);
        
        if (timeRemaining > 0 && session.isRunning) {
          setSavedSession({ ...session, time: timeRemaining });
          setShowResumeDialog(true);
        } else {
          localStorage.removeItem('monofocus_session');
        }
      } catch (e) {
        localStorage.removeItem('monofocus_session');
      }
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Save session to localStorage
  useEffect(() => {
    if (isRunning && time > 0) {
      const session: TimerState = {
        time,
        initialTime,
        isRunning,
        isPaused,
        timestamp: Date.now()
      };
      localStorage.setItem('monofocus_session', JSON.stringify(session));
    }
  }, [time, initialTime, isRunning, isPaused]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement) return;
      
      // Don't trigger if modal is open
      if (showTimePicker || showCompletion || showResumeDialog) {
        if (e.key === 'Escape') {
          if (showTimePicker) setShowTimePicker(false);
          if (showCompletion) setShowCompletion(false);
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          if (!isRunning && time > 0) {
            handleStart();
          } else if (isRunning && !isPaused) {
            handlePause();
          } else if (isPaused) {
            handleResume();
          }
          break;
        case 'escape':
          if (isRunning) {
            handleStop();
          }
          break;
        case '1':
          if (!isRunning) handlePresetClick(15);
          break;
        case '2':
          if (!isRunning) handlePresetClick(30);
          break;
        case '3':
          if (!isRunning) handlePresetClick(60);
          break;
        case 'c':
          if (!isRunning) setShowTimePicker(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isPaused, time, showTimePicker, showCompletion, showResumeDialog]);

  const handleTimerComplete = () => {
    haptics.timerComplete();
    setIsRunning(false);
    setIsPaused(false);
    setShowCompletion(true);
    localStorage.removeItem('monofocus_session');
    toast.success('Focus session completed!');
  };

  const handleResumeSession = () => {
    if (savedSession) {
      setTime(savedSession.time);
      setInitialTime(savedSession.initialTime);
      setIsRunning(true);
      setIsPaused(false);
      setShowResumeDialog(false);
      toast.success('Session resumed!');
    }
  };

  const handleDiscardSession = () => {
    localStorage.removeItem('monofocus_session');
    setShowResumeDialog(false);
    setSavedSession(null);
  };

  const handlePresetClick = (minutes: number) => {
    if (!isRunning) {
      haptics.selection();
      const seconds = minutes * 60;
      setTime(seconds);
      setInitialTime(seconds);
    }
  };

  const handleCustomTime = (minutes: number) => {
    const seconds = minutes * 60;
    setTime(seconds);
    setInitialTime(seconds);
    setShowTimePicker(false);
  };

  const handleStart = () => {
    if (time > 0) {
      haptics.timerStart();
      setIsRunning(true);
      setIsPaused(false);
      if (initialTime === 0) {
        setInitialTime(time);
      }
    } else {
      haptics.error();
      toast.error('Please set a time first');
    }
  };

  const handlePause = () => {
    haptics.timerPause();
    setIsPaused(true);
  };

  const handleResume = () => {
    haptics.timerStart();
    setIsPaused(false);
  };

  const handleStop = () => {
    haptics.timerStop();
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setInitialTime(0);
    localStorage.removeItem('monofocus_session');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleDnd = () => {
    const newState = !isDndActive;
    if (newState) {
      haptics.toggleOn();
    } else {
      haptics.toggleOff();
    }
    setIsDndActive(newState);
  };

  const toggleTheme = () => {
    haptics.selection();
    setIsDarkMode(!isDarkMode);
  };

  const progress = initialTime > 0 ? ((initialTime - time) / initialTime) * 100 : 0;

  return (
    <div 
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-black' : 'bg-white'
      }`}
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 px-4 py-2 rounded-lg ${
          isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
        }`}
        style={{ fontSize: '15px', fontWeight: 600 }}
      >
        Skip to main content
      </a>

      {/* iOS Device Container */}
      <div className={`w-full max-w-[430px] min-h-screen ${
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
      } relative flex flex-col`}>
        {/* Status Bar with Real-time Clock */}
        <StatusBar isDarkMode={isDarkMode} />

        {/* Main Content - Scrollable */}
        <div id="main-content" className="flex-1 overflow-y-auto px-6 pt-12 pb-8">
          {/* Header with Theme Toggle */}
          <div className="flex justify-between items-start mb-12">
            <h1 
              className="tracking-tight" 
              style={{ 
                fontSize: 'var(--font-size-large-title)', 
                fontWeight: 'var(--font-weight-bold)',
                fontFamily: 'var(--font-system)',
              }}
            >
              MonoFocus
            </h1>
            <motion.button 
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors ${
                isDarkMode ? 'bg-white/10 hover:bg-white/20 active:bg-white/25' : 'bg-black/10 hover:bg-black/20 active:bg-black/25'
              }`}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Timer Display */}
          <Timer 
            time={time} 
            isDarkMode={isDarkMode} 
            progress={progress}
            isRunning={isRunning}
            isPaused={isPaused}
            initialTime={initialTime}
          />

          {/* Empty State */}
          <AnimatePresence>
            {time === 0 && !isRunning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20 }}
                className="text-center mb-6"
              >
                <motion.div
                  animate={prefersReducedMotion ? {} : { 
                    y: [0, -8, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="flex justify-center mb-3"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-white/10' : 'bg-black/10'
                  }`}>
                    <TimerIcon className="w-6 h-6" />
                  </div>
                </motion.div>
                <p 
                  className={`mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/70'}`} 
                  style={{ 
                    fontSize: 'var(--font-size-body)', 
                    fontWeight: 'var(--font-weight-semibold)',
                    fontFamily: 'var(--font-system)',
                  }}
                >
                  Start your focus journey
                </p>
                <p 
                  className={`${isDarkMode ? 'text-white/50' : 'text-black/50'}`} 
                  style={{ 
                    fontSize: 'var(--font-size-subheadline)',
                    fontFamily: 'var(--font-system)',
                  }}
                >
                  Try 30 min to stay focused
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preset Buttons */}
          <PresetButtons 
            onPresetClick={handlePresetClick} 
            onCustomClick={() => setShowTimePicker(true)}
            disabled={isRunning}
            isDarkMode={isDarkMode}
            selectedTime={time}
          />

          {/* Control Buttons */}
          <ControlButtons
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            isDarkMode={isDarkMode}
          />

          {/* Automation Section */}
          <AutomationSection
            isDndActive={isDndActive}
            onToggleDnd={toggleDnd}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 shrink-0">
          <div 
            className={`w-[134px] h-[5px] rounded-full ${
              isDarkMode ? 'bg-white' : 'bg-black'
            }`}
            style={{ opacity: 0.36 }}
          />
        </div>
      </div>

      {/* Time Picker Modal */}
      <TimePicker
        isOpen={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onConfirm={handleCustomTime}
        isDarkMode={isDarkMode}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        isDarkMode={isDarkMode}
      />

      {/* Resume Session Dialog */}
      {showResumeDialog && savedSession && (
        <ResumeSessionDialog
          isOpen={showResumeDialog}
          onResume={handleResumeSession}
          onDiscard={handleDiscardSession}
          timeRemaining={savedSession.time}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts isDarkMode={isDarkMode} />

      {/* Toast Notifications - Positioned above home indicator */}
      <Toaster
        position="bottom-center"
        theme={isDarkMode ? 'dark' : 'light'}
        toastOptions={{
          style: {
            background: isDarkMode ? '#171717' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-4)',
            bottom: 'calc(var(--home-indicator-height) + var(--spacing-6))',
            maxWidth: '390px',
            width: 'calc(100% - 48px)',
            fontFamily: 'var(--font-system)',
            fontSize: 'var(--font-size-subheadline)',
          },
        }}
      />
    </div>
  );
}
