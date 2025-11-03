import { useRealTimeClock, formatStatusBarTime } from './hooks/useRealTimeClock';

interface StatusBarProps {
  isDarkMode: boolean;
}

export function StatusBar({ isDarkMode }: StatusBarProps) {
  const currentTime = useRealTimeClock();
  const timeString = formatStatusBarTime(currentTime);

  return (
    <div className="pt-3 px-6 flex justify-between items-center h-11 shrink-0">
      {/* Time */}
      <div className="flex items-center gap-1">
        <span 
          className={isDarkMode ? 'text-white' : 'text-black'}
          style={{ 
            fontSize: 'var(--font-size-subheadline)',
            fontWeight: 'var(--font-weight-semibold)',
            fontFamily: 'var(--font-system)',
          }}
        >
          {timeString}
        </span>
      </div>
      
      {/* Battery & Signal Indicators */}
      <div className="flex items-center gap-1.5">
        {/* Battery Icon */}
        <svg 
          width="27" 
          height="13" 
          viewBox="0 0 27 13" 
          fill="none" 
          className={isDarkMode ? 'text-white' : 'text-black'}
          aria-hidden="true"
        >
          {/* Battery outline */}
          <rect 
            x="0.5" 
            y="0.5" 
            width="22" 
            height="12" 
            rx="2.5" 
            stroke="currentColor"
            strokeOpacity="0.35"
            fill="none"
          />
          {/* Battery fill */}
          <rect 
            x="2" 
            y="2" 
            width="19" 
            height="9" 
            rx="1.5" 
            fill="currentColor"
          />
          {/* Battery cap */}
          <path 
            d="M24 4.5C24 4.22386 24.2239 4 24.5 4H25.5C25.7761 4 26 4.22386 26 4.5V8.5C26 8.77614 25.7761 9 25.5 9H24.5C24.2239 9 24 8.77614 24 8.5V4.5Z" 
            fill="currentColor"
            fillOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
