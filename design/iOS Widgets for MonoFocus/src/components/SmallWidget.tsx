import { Play, Pause, CheckCircle2, Zap } from 'lucide-react';

type WidgetState = 'idle' | 'active' | 'paused' | 'completed' | 'automation';
type ColorMode = 'light' | 'dark';

interface SmallWidgetProps {
  state: WidgetState;
  colorMode: ColorMode;
}

export function SmallWidget({ state, colorMode }: SmallWidgetProps) {
  const isLight = colorMode === 'light';

  // Widget container styles
  const widgetBg = isLight ? 'bg-white' : 'bg-black';
  const widgetShadow = isLight ? 'shadow-lg' : 'shadow-2xl shadow-black/50';
  const primaryText = isLight ? 'text-gray-900' : 'text-white';
  const secondaryText = isLight ? 'text-gray-500' : 'text-gray-400';
  const accentColor = isLight ? 'stroke-gray-900' : 'stroke-white';

  // State-specific values
  const getStateValues = () => {
    switch (state) {
      case 'idle':
        return { time: '--:--', label: 'No Timer', progress: 0, icon: Play };
      case 'active':
        return { time: '15:00', label: 'Focus Time', progress: 50, icon: null };
      case 'paused':
        return { time: '08:30', label: 'Paused', progress: 72, icon: Pause };
      case 'completed':
        return { time: '00:00', label: 'Completed', progress: 100, icon: CheckCircle2 };
      case 'automation':
        return { time: '22:15', label: 'Automation', progress: 26, icon: Zap };
      default:
        return { time: '00:00', label: 'Focus', progress: 0, icon: null };
    }
  };

  const { time, label, progress, icon: StateIcon } = getStateValues();

  // Progress circle calculations
  const size = 140;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="inline-block">
      {/* Widget Container - iOS standard small widget size */}
      <div
        className={`${widgetBg} ${widgetShadow} rounded-[20px] p-4 w-[169px] h-[169px] flex items-center justify-center relative overflow-hidden transition-all duration-300`}
        style={{ boxShadow: isLight ? '0 2px 10px rgba(0,0,0,0.1)' : '0 2px 20px rgba(0,0,0,0.5)' }}
      >
        {/* Automation indicator (top right) */}
        {state === 'automation' && (
          <div className="absolute top-3 right-3">
            <Zap size={14} className={isLight ? 'text-gray-900' : 'text-white'} fill={isLight ? '#000' : '#fff'} />
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col items-center justify-center">
          {/* Progress Ring */}
          <div className="relative mb-3">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={isLight ? '#f3f4f6' : '#1f2937'}
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              {progress > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  className={accentColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.3s ease',
                    opacity: state === 'paused' ? 0.5 : 1,
                  }}
                />
              )}
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {StateIcon && state !== 'automation' ? (
                <StateIcon
                  size={32}
                  className={primaryText}
                  fill={state === 'completed' ? (isLight ? '#000' : '#fff') : 'none'}
                  strokeWidth={state === 'idle' ? 2 : 2}
                  style={{ opacity: state === 'paused' ? 0.7 : 1 }}
                />
              ) : (
                <>
                  <div
                    className={`${primaryText} tabular-nums`}
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      lineHeight: '1',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.5px',
                      opacity: state === 'paused' ? 0.7 : 1,
                    }}
                  >
                    {time}
                  </div>
                  <div
                    className={secondaryText}
                    style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      marginTop: '4px',
                      opacity: state === 'paused' ? 0.7 : 1,
                    }}
                  >
                    {label}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Label for icon states */}
          {StateIcon && state !== 'automation' && (
            <div
              className={secondaryText}
              style={{
                fontSize: '11px',
                fontWeight: '500',
                opacity: state === 'paused' ? 0.7 : 1,
              }}
            >
              {label}
            </div>
          )}
        </div>

        {/* Paused state overlay effect */}
        {state === 'paused' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isLight
                ? 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)',
            }}
          />
        )}
      </div>

      {/* Annotation */}
      <div className="mt-4 text-center">
        <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontSize: '12px' }}>
          Tap anywhere → Open app
        </p>
      </div>
    </div>
  );
}
