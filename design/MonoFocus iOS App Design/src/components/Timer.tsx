import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from './hooks/useReducedMotion';

interface TimerProps {
  time: number;
  isDarkMode: boolean;
  progress: number;
  isRunning: boolean;
  isPaused: boolean;
  initialTime: number;
}

export function Timer({ time, isDarkMode, progress, isRunning, isPaused, initialTime }: TimerProps) {
  const prefersReducedMotion = useReducedMotion();
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const circumference = 2 * Math.PI * 134; // radius of 134 (280px diameter / 2 - stroke)
  // Reverse progress: starts full, empties as time runs out
  const strokeDashoffset = (progress / 100) * circumference;
  
  // Format time remaining for display
  const formatTimeRemaining = () => {
    if (time === 0) return 'Set your focus time';
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    if (mins === 0) return `${secs} second${secs !== 1 ? 's' : ''} left`;
    if (secs === 0) return `${mins} minute${mins !== 1 ? 's' : ''} left`;
    return `${mins}m ${secs}s left`;
  };

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Paused Label */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            className={`mb-3 px-4 py-1.5 rounded-full ${
              isDarkMode ? 'bg-white/20' : 'bg-black/20'
            }`}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
              PAUSED
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Circle */}
      <div className="relative mb-4">
        <svg className="w-[280px] h-[280px] -rotate-90" aria-hidden="true">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="134"
            stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
            strokeWidth="6"
            fill="none"
            strokeDasharray={initialTime === 0 && time === 0 ? "8 8" : "none"}
          />
          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? '#ffffff' : '#000000'} stopOpacity="1" />
              <stop offset="100%" stopColor={isDarkMode ? '#ffffff' : '#000000'} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="140"
            cy="140"
            r="134"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ 
              strokeDashoffset,
              opacity: isPaused && !prefersReducedMotion ? [1, 0.5, 1] : 1
            }}
            transition={{ 
              strokeDashoffset: { duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' },
              opacity: isPaused && !prefersReducedMotion 
                ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } 
                : { duration: 0.3 }
            }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Timer Display - Centered in circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div 
            className="flex items-center gap-3"
            animate={{ opacity: isPaused ? 0.6 : 1 }}
            transition={{ duration: 0.3 }}
            role="timer" 
            aria-live="off"
            aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
          >
            <motion.div 
              className={`flex items-center justify-center w-16 h-20 rounded-3xl ${
                isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              style={{
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(255, 255, 255, 0.15)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              whileHover={!isRunning ? { scale: 1.02 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="tracking-tight" style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1 }}>
                {formatTime(minutes)[0]}
              </span>
            </motion.div>
            <motion.div 
              className={`flex items-center justify-center w-16 h-20 rounded-3xl ${
                isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              style={{
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(255, 255, 255, 0.15)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              whileHover={!isRunning ? { scale: 1.02 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="tracking-tight" style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1 }}>
                {formatTime(minutes)[1]}
              </span>
            </motion.div>
            <span 
              className="mx-1" 
              style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1 }}
              aria-hidden="true"
            >
              :
            </span>
            <motion.div 
              className={`flex items-center justify-center w-16 h-20 rounded-3xl ${
                isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              style={{
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(255, 255, 255, 0.15)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              whileHover={!isRunning ? { scale: 1.02 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="tracking-tight" style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1 }}>
                {formatTime(seconds)[0]}
              </span>
            </motion.div>
            <motion.div 
              className={`flex items-center justify-center w-16 h-20 rounded-3xl ${
                isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              style={{
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(255, 255, 255, 0.15)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              whileHover={!isRunning ? { scale: 1.02 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="tracking-tight" style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1 }}>
                {formatTime(seconds)[1]}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Time Remaining Text */}
      <motion.p
        className={`text-center ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}
        style={{ fontSize: '15px', fontWeight: 500 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.2 }}
      >
        {formatTimeRemaining()}
      </motion.p>
    </div>
  );
}
