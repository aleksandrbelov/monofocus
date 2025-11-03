import { motion } from 'motion/react';
import { useFocusTrap } from './hooks/useFocusTrap';

interface ResumeSessionDialogProps {
  isOpen: boolean;
  onResume: () => void;
  onDiscard: () => void;
  timeRemaining: number;
  isDarkMode: boolean;
}

export function ResumeSessionDialog({ 
  isOpen, 
  onResume, 
  onDiscard, 
  timeRemaining,
  isDarkMode 
}: ResumeSessionDialogProps) {
  const containerRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

      {/* Dialog */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[340px] rounded-3xl p-6 ${
          isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'
        }`}
        style={{ boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)' }}
        role="dialog"
        aria-labelledby="resume-title"
        aria-describedby="resume-description"
      >
        <h2 id="resume-title" className="mb-2" style={{ fontSize: '22px', fontWeight: 700 }}>
          Continue Session?
        </h2>
        <p 
          id="resume-description"
          className={`mb-6 ${isDarkMode ? 'text-white/70' : 'text-black/70'}`}
          style={{ fontSize: '15px', lineHeight: 1.4 }}
        >
          You have an active focus session with{' '}
          <span style={{ fontWeight: 600 }}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>{' '}
          remaining.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onDiscard}
            className={`flex-1 min-h-[44px] py-3 rounded-full border-2 transition-colors ${
              isDarkMode 
                ? 'border-white/30 hover:border-white/50 hover:bg-white/10' 
                : 'border-black/30 hover:border-black/50 hover:bg-black/10'
            }`}
            style={{ fontSize: '17px', fontWeight: 600 }}
          >
            Discard
          </button>
          <button
            onClick={onResume}
            className={`flex-1 min-h-[44px] py-3 rounded-full ${
              isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
            }`}
            style={{ fontSize: '17px', fontWeight: 600 }}
            autoFocus
          >
            Resume
          </button>
        </div>
      </motion.div>
    </>
  );
}
