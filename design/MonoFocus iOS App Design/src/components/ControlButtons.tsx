import { motion } from 'motion/react';
import { Play, Pause, Square } from 'lucide-react';

interface ControlButtonsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isDarkMode: boolean;
}

export function ControlButtons({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  isDarkMode
}: ControlButtonsProps) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      {!isRunning ? (
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`min-h-[44px] px-12 py-3 rounded-full flex items-center gap-2 ${
            isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          style={{ fontSize: '17px', fontWeight: 600 }}
          aria-label="Start timer"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Start
        </motion.button>
      ) : isPaused ? (
        <motion.button
          onClick={onResume}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`min-h-[48px] px-14 py-3 rounded-full flex items-center gap-2 shadow-lg ${
            isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          style={{ fontSize: '18px', fontWeight: 600 }}
          aria-label="Resume timer"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          Resume
        </motion.button>
      ) : (
        <motion.button
          onClick={onPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`min-h-[44px] px-12 py-3 rounded-full flex items-center gap-2 ${
            isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          style={{ fontSize: '17px', fontWeight: 600 }}
          aria-label="Pause timer"
        >
          <Pause className="w-4 h-4" fill="currentColor" />
          Pause
        </motion.button>
      )}
      
      {(isRunning || isPaused) && (
        <motion.button
          onClick={onStop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`min-h-[44px] px-12 py-3 rounded-full border-2 flex items-center gap-2 transition-colors ${
            isDarkMode 
              ? 'border-white/30 hover:border-white/50 hover:bg-white/10' 
              : 'border-black/30 hover:border-black/50 hover:bg-black/10'
          }`}
          style={{ fontSize: '17px', fontWeight: 600 }}
          aria-label="Stop timer"
        >
          <Square className="w-4 h-4" fill="currentColor" />
          Stop
        </motion.button>
      )}
    </div>
  );
}
