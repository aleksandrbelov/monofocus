import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command } from 'lucide-react';

interface KeyboardShortcutsProps {
  isDarkMode: boolean;
}

export function KeyboardShortcuts({ isDarkMode }: KeyboardShortcutsProps) {
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show hints on Cmd/Ctrl + /
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowHints(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const shortcuts = [
    { key: 'Space', action: 'Start/Pause/Resume' },
    { key: 'Esc', action: 'Stop timer or close modal' },
    { key: '1-3', action: 'Select preset (15/30/60 min)' },
    { key: 'C', action: 'Custom time' },
    { key: '⌘ /', action: 'Toggle shortcuts' },
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setShowHints(prev => !prev)}
        className={`fixed bottom-24 right-6 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all z-40 ${
          isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
        }`}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (⌘/)"
      >
        <Command className="w-5 h-5" />
      </button>

      {/* Shortcuts panel */}
      <AnimatePresence>
        {showHints && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHints(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-24 right-6 w-[280px] rounded-2xl p-4 z-50 ${
                isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'
              }`}
              style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)' }}
            >
              <h3 className="mb-3" style={{ fontSize: '17px', fontWeight: 600 }}>
                Keyboard Shortcuts
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`${isDarkMode ? 'text-white/70' : 'text-black/70'}`} style={{ fontSize: '15px' }}>
                      {shortcut.action}
                    </span>
                    <kbd
                      className={`px-2 py-1 rounded ${
                        isDarkMode ? 'bg-white/10' : 'bg-black/10'
                      }`}
                      style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}
                    >
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
