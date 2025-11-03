import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

interface PresetButtonsProps {
  onPresetClick: (minutes: number) => void;
  onCustomClick: () => void;
  disabled: boolean;
  isDarkMode: boolean;
  selectedTime?: number;
}

export function PresetButtons({ onPresetClick, onCustomClick, disabled, isDarkMode, selectedTime = 0 }: PresetButtonsProps) {
  // iOS-standard time intervals
  const presets = [
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '60m', value: 60 },
  ];

  const isSelected = (minutes: number) => selectedTime === minutes * 60;

  return (
    <div className="flex justify-center gap-3 mb-6">
      {presets.map((preset) => {
        const selected = isSelected(preset.value);
        return (
          <motion.button
            key={preset.value}
            onClick={() => onPresetClick(preset.value)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`min-h-[44px] px-6 py-3 rounded-full transition-all ${
              selected
                ? isDarkMode
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 active:bg-white/15 disabled:bg-white/5' 
                  : 'bg-black/10 hover:bg-black/20 active:bg-black/15 disabled:bg-black/5'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ fontSize: '17px', fontWeight: 600 }}
            aria-label={`Set timer to ${preset.value} minutes`}
            aria-pressed={selected}
          >
            {preset.label}
          </motion.button>
        );
      })}
      
      {/* Custom Time Button */}
      <motion.button
        onClick={onCustomClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`min-h-[44px] min-w-[44px] px-3 py-3 rounded-full transition-all flex items-center justify-center ${
          isDarkMode 
            ? 'bg-white/10 hover:bg-white/20 active:bg-white/15 disabled:bg-white/5' 
            : 'bg-black/10 hover:bg-black/20 active:bg-black/15 disabled:bg-black/5'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Set custom time"
      >
        <Clock className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
