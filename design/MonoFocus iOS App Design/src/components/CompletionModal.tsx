import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useFocusTrap } from './hooks/useFocusTrap';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function CompletionModal({ isOpen, onClose, isDarkMode }: CompletionModalProps) {
  const containerRef = useFocusTrap(isOpen);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[320px] rounded-3xl p-8 text-center ${
              isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'
            }`}
            style={{ boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)' }}
            role="dialog"
            aria-labelledby="completion-title"
            aria-describedby="completion-description"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
              className="flex justify-center mb-6"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-white/10' : 'bg-black/10'
              }`}>
                <CheckCircle2 className="w-10 h-10" strokeWidth={2} />
              </div>
            </motion.div>

            {/* Text */}
            <h2 id="completion-title" className="mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>Well Done!</h2>
            <p 
              id="completion-description"
              className={`mb-8 ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}
              style={{ fontSize: '17px' }}
            >
              You've completed your focus session
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`w-full min-h-[44px] py-3 rounded-full ${
                isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              style={{ fontSize: '17px', fontWeight: 600 }}
              autoFocus
            >
              Continue
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
