import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useFocusTrap } from './hooks/useFocusTrap';

interface TimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
  isDarkMode: boolean;
}

export function TimePicker({ isOpen, onClose, onConfirm, isDarkMode }: TimePickerProps) {
  const containerRef = useFocusTrap(isOpen);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [hoursInput, setHoursInput] = useState('00');
  const [minutesInput, setMinutesInput] = useState('25');
  
  const longPressIntervalRef = useRef<number | null>(null);
  const longPressTimeoutRef = useRef<number | null>(null);

  // Remember last custom time using localStorage
  useEffect(() => {
    if (isOpen) {
      const savedTime = localStorage.getItem('monofocus_custom_time');
      if (savedTime) {
        const totalMinutes = parseInt(savedTime);
        const savedHours = Math.floor(totalMinutes / 60);
        const savedMinutes = totalMinutes % 60;
        setHours(savedHours);
        setMinutes(savedMinutes);
        setHoursInput(savedHours.toString().padStart(2, '0'));
        setMinutesInput(savedMinutes.toString().padStart(2, '0'));
      }
    }
  }, [isOpen]);

  const totalMinutes = hours * 60 + minutes;

  const handleConfirm = () => {
    if (totalMinutes === 0) {
      toast.error('Please set a time greater than 0');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('monofocus_custom_time', totalMinutes.toString());
    onConfirm(totalMinutes);
  };

  const handlePresetClick = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    setHours(h);
    setMinutes(m);
    setHoursInput(h.toString().padStart(2, '0'));
    setMinutesInput(m.toString().padStart(2, '0'));
  };

  // Simple increment/decrement
  const incrementHours = () => {
    const newValue = (hours + 1) % 24;
    setHours(newValue);
    setHoursInput(newValue.toString().padStart(2, '0'));
  };
  
  const decrementHours = () => {
    const newValue = (hours - 1 + 24) % 24;
    setHours(newValue);
    setHoursInput(newValue.toString().padStart(2, '0'));
  };
  
  const incrementMinutes = () => {
    const newValue = (minutes + 1) % 60;
    setMinutes(newValue);
    setMinutesInput(newValue.toString().padStart(2, '0'));
  };
  
  const decrementMinutes = () => {
    const newValue = (minutes - 1 + 60) % 60;
    setMinutes(newValue);
    setMinutesInput(newValue.toString().padStart(2, '0'));
  };

  // Long press handlers
  const startLongPress = (action: () => void) => {
    action(); // Execute immediately
    longPressTimeoutRef.current = window.setTimeout(() => {
      longPressIntervalRef.current = window.setInterval(action, 100);
    }, 500); // Start repeating after 500ms hold
  };

  const stopLongPress = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    if (longPressIntervalRef.current) {
      clearInterval(longPressIntervalRef.current);
      longPressIntervalRef.current = null;
    }
  };

  // Handle input changes
  const handleHoursInputChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 2);
    setHoursInput(cleaned);
    const num = parseInt(cleaned) || 0;
    if (num >= 0 && num < 24) {
      setHours(num);
    }
  };

  const handleMinutesInputChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 2);
    setMinutesInput(cleaned);
    const num = parseInt(cleaned) || 0;
    if (num >= 0 && num < 60) {
      setMinutes(num);
    }
  };

  const presets = [
    { label: '5m', value: 5 },
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '60m', value: 60 },
  ];

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[360px] rounded-3xl p-6 ${
              isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'
            }`}
            style={{ boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)' }}
            role="dialog"
            aria-labelledby="timepicker-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="timepicker-title" style={{ fontSize: '22px', fontWeight: 700 }}>Set Time</h2>
              <button
                onClick={onClose}
                className={`min-w-[32px] min-h-[32px] rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2 mb-6">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset.value)}
                  className={`flex-1 min-h-[36px] py-2 rounded-full transition-colors ${
                    isDarkMode 
                      ? 'bg-white/10 hover:bg-white/20 active:bg-white/15' 
                      : 'bg-black/10 hover:bg-black/20 active:bg-black/15'
                  }`}
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Time Picker */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  onMouseDown={() => startLongPress(incrementHours)}
                  onMouseUp={stopLongPress}
                  onMouseLeave={stopLongPress}
                  onTouchStart={() => startLongPress(incrementHours)}
                  onTouchEnd={stopLongPress}
                  className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors ${
                    isDarkMode ? 'hover:bg-white/10 active:bg-white/20' : 'hover:bg-black/10 active:bg-black/20'
                  }`}
                  aria-label="Increment hours"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 12.5L10 7.5L15 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={hoursInput}
                  onChange={(e) => handleHoursInputChange(e.target.value)}
                  onBlur={() => setHoursInput(hours.toString().padStart(2, '0'))}
                  className={`w-20 h-24 flex items-center justify-center text-center rounded-2xl my-2 outline-none ${
                    isDarkMode ? 'bg-white/10 focus:bg-white/15' : 'bg-black/10 focus:bg-black/15'
                  }`}
                  style={{ fontSize: '48px', fontWeight: 700 }}
                  aria-label="Hours"
                />
                <button
                  onMouseDown={() => startLongPress(decrementHours)}
                  onMouseUp={stopLongPress}
                  onMouseLeave={stopLongPress}
                  onTouchStart={() => startLongPress(decrementHours)}
                  onTouchEnd={stopLongPress}
                  className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors ${
                    isDarkMode ? 'hover:bg-white/10 active:bg-white/20' : 'hover:bg-black/10 active:bg-black/20'
                  }`}
                  aria-label="Decrement hours"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 7.5L10 12.5L5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className={`mt-2 ${isDarkMode ? 'text-white/50' : 'text-black/50'}`} style={{ fontSize: '13px' }}>hours</span>
              </div>

              {/* Separator */}
              <span style={{ fontSize: '48px', fontWeight: 700, marginBottom: '32px' }}>:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  onMouseDown={() => startLongPress(incrementMinutes)}
                  onMouseUp={stopLongPress}
                  onMouseLeave={stopLongPress}
                  onTouchStart={() => startLongPress(incrementMinutes)}
                  onTouchEnd={stopLongPress}
                  className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors ${
                    isDarkMode ? 'hover:bg-white/10 active:bg-white/20' : 'hover:bg-black/10 active:bg-black/20'
                  }`}
                  aria-label="Increment minutes"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 12.5L10 7.5L15 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={minutesInput}
                  onChange={(e) => handleMinutesInputChange(e.target.value)}
                  onBlur={() => setMinutesInput(minutes.toString().padStart(2, '0'))}
                  className={`w-20 h-24 flex items-center justify-center text-center rounded-2xl my-2 outline-none ${
                    isDarkMode ? 'bg-white/10 focus:bg-white/15' : 'bg-black/10 focus:bg-black/15'
                  }`}
                  style={{ fontSize: '48px', fontWeight: 700 }}
                  aria-label="Minutes"
                />
                <button
                  onMouseDown={() => startLongPress(decrementMinutes)}
                  onMouseUp={stopLongPress}
                  onMouseLeave={stopLongPress}
                  onTouchStart={() => startLongPress(decrementMinutes)}
                  onTouchEnd={stopLongPress}
                  className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors ${
                    isDarkMode ? 'hover:bg-white/10 active:bg-white/20' : 'hover:bg-black/10 active:bg-black/20'
                  }`}
                  aria-label="Decrement minutes"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 7.5L10 12.5L5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className={`mt-2 ${isDarkMode ? 'text-white/50' : 'text-black/50'}`} style={{ fontSize: '13px' }}>minutes</span>
              </div>
            </div>

            {/* Total time display */}
            <div className="text-center mb-6">
              <p className={`${isDarkMode ? 'text-white/60' : 'text-black/60'}`} style={{ fontSize: '15px' }}>
                Total: <span style={{ fontWeight: 600 }}>{totalMinutes} minute{totalMinutes !== 1 ? 's' : ''}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`flex-1 min-h-[44px] py-3 rounded-full border-2 transition-colors ${
                  isDarkMode 
                    ? 'border-white/30 hover:border-white/50 hover:bg-white/10' 
                    : 'border-black/30 hover:border-black/50 hover:bg-black/10'
                }`}
                style={{ fontSize: '17px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={totalMinutes === 0}
                className={`flex-1 min-h-[44px] py-3 rounded-full transition-all ${
                  totalMinutes === 0
                    ? isDarkMode
                      ? 'bg-white/20 text-white/40 cursor-not-allowed'
                      : 'bg-black/20 text-black/40 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-white text-black hover:bg-white/90' 
                      : 'bg-black text-white hover:bg-black/90'
                }`}
                style={{ fontSize: '17px', fontWeight: 600 }}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
