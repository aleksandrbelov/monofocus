import { Play, Pause, CheckCircle2, Zap } from 'lucide-react';

type WidgetState = 'idle' | 'active' | 'paused' | 'completed' | 'automation';
type ColorMode = 'light' | 'dark';

interface MediumWidgetProps {
  state: WidgetState;
  colorMode: ColorMode;
}

export function MediumWidget({ state, colorMode }: MediumWidgetProps) {
  const isLight = colorMode === 'light';

  // Widget container styles
  const widgetBg = isLight ? 'bg-white' : 'bg-black';
  const widgetShadow = isLight ? 'shadow-lg' : 'shadow-2xl shadow-black/50';
  const primaryText = isLight ? 'text-gray-900' : 'text-white';
  const secondaryText = isLight ? 'text-gray-500' : 'text-gray-400';
  const buttonBg = isLight ? 'bg-gray-100' : 'bg-gray-900';
  const buttonBorder = isLight ? 'border-gray-200' : 'border-gray-800';
  const accentColor = isLight ? 'stroke-gray-900' : 'stroke-white';

  // State-specific values
  const getStateValues = () => {
    switch (state) {
      case 'idle':
        return { time: '--:--', label: 'Start Focus', progress: 0, icon: Play, showIcon: true };
      case 'active':
        return { time: '15:00', label: 'Focus Time', progress: 50, icon: null, showIcon: false };
      case 'paused':
        return { time: '08:30', label: 'Paused', progress: 72, icon: Pause, showIcon: true };
      case 'completed':
        return { time: '00:00', label: 'Well Done!', progress: 100, icon: CheckCircle2, showIcon: true };
      case 'automation':
        return { time: '22:15', label: 'Automation Active', progress: 26, icon: null, showIcon: false };
      default:
        return { time: '00:00', label: 'Focus', progress: 0, icon: null, showIcon: false };
    }
  };

  const { time, label, progress, icon: StateIcon, showIcon } = getStateValues();

  // Progress circle calculations
  const size = 100;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const presets = [
    { duration: '15m', label: '15 min' },
    { duration: '30m', label: '30 min' },
    { duration: '60m', label: '60 min' },
  ];

  return (
    <div className="inline-block">
      {/* Widget Container - iOS standard medium widget size */}
      <div
        className={`${widgetBg} ${widgetShadow} rounded-[20px] p-4 w-[360px] h-[169px] flex items-center gap-4 relative overflow-hidden transition-all duration-300`}
        style={{ boxShadow: isLight ? '0 2px 10px rgba(0,0,0,0.1)' : '0 2px 20px rgba(0,0,0,0.5)' }}
      >
        {/* Left Section - Current Timer */}
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center">
            {/* Progress Ring */}
            <div className="relative">
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
                {showIcon && StateIcon ? (
                  <StateIcon
                    size={28}
                    className={primaryText}
                    fill={state === 'completed' ? (isLight ? '#000' : '#fff') : 'none'}
                    strokeWidth={2}
                    style={{ opacity: state === 'paused' ? 0.7 : 1 }}
                  />
                ) : (
                  <div
                    className={`${primaryText} tabular-nums`}
                    style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      lineHeight: '1',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.5px',
                      opacity: state === 'paused' ? 0.7 : 1,
                    }}
                  >
                    {time}
                  </div>
                )}
              </div>

              {/* Automation indicator */}
              {state === 'automation' && (
                <div className="absolute -top-1 -right-1">
                  <Zap size={12} className={isLight ? 'text-gray-900' : 'text-white'} fill={isLight ? '#000' : '#fff'} />
                </div>
              )}
            </div>

            {/* Label */}
            <div
              className={secondaryText}
              style={{
                fontSize: '11px',
                fontWeight: '500',
                marginTop: '6px',
                opacity: state === 'paused' ? 0.7 : 1,
              }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-px h-[120px] self-center"
          style={{ backgroundColor: isLight ? '#e5e7eb' : '#374151' }}
        />

        {/* Right Section - Quick Actions */}
        <div className="flex-1 flex flex-col justify-center gap-2 h-full py-2">
          <div
            className={secondaryText}
            style={{
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}
          >
            Quick Start
          </div>
          {presets.map((preset) => (
            <button
              key={preset.duration}
              className={`${buttonBg} ${buttonBorder} border rounded-xl px-4 py-3 transition-all hover:scale-[1.02] active:scale-[0.98]`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span
                className={primaryText}
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {preset.label}
              </span>
              <Play
                size={14}
                className={secondaryText}
                fill={isLight ? '#6b7280' : '#9ca3af'}
              />
            </button>
          ))}
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

      {/* Annotations */}
      <div className="mt-4 flex justify-between" style={{ fontSize: '12px' }}>
        <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Tap timer → Open active timer
        </p>
        <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Tap preset → Start timer
        </p>
      </div>
    </div>
  );
}
