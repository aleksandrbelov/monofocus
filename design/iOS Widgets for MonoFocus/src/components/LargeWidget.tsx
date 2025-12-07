import { Play, Pause, CheckCircle2, Zap, TrendingUp, Clock } from 'lucide-react';

type WidgetState = 'idle' | 'active' | 'paused' | 'completed' | 'automation';
type ColorMode = 'light' | 'dark';

interface LargeWidgetProps {
  state: WidgetState;
  colorMode: ColorMode;
}

export function LargeWidget({ state, colorMode }: LargeWidgetProps) {
  const isLight = colorMode === 'light';

  // Widget container styles
  const widgetBg = isLight ? 'bg-white' : 'bg-black';
  const widgetShadow = isLight ? 'shadow-lg' : 'shadow-2xl shadow-black/50';
  const primaryText = isLight ? 'text-gray-900' : 'text-white';
  const secondaryText = isLight ? 'text-gray-500' : 'text-gray-400';
  const tertiaryText = isLight ? 'text-gray-400' : 'text-gray-600';
  const buttonBg = isLight ? 'bg-gray-100' : 'bg-gray-900';
  const buttonBorder = isLight ? 'border-gray-200' : 'border-gray-800';
  const statBg = isLight ? 'bg-gray-50' : 'bg-gray-900/50';
  const accentColor = isLight ? 'stroke-gray-900' : 'stroke-white';

  // State-specific values
  const getStateValues = () => {
    switch (state) {
      case 'idle':
        return { time: '--:--', label: 'No Active Timer', progress: 0, icon: Play, showIcon: true };
      case 'active':
        return { time: '15:00', label: 'Deep Focus', progress: 50, icon: null, showIcon: false };
      case 'paused':
        return { time: '08:30', label: 'Timer Paused', progress: 72, icon: Pause, showIcon: true };
      case 'completed':
        return { time: '00:00', label: 'Session Complete!', progress: 100, icon: CheckCircle2, showIcon: true };
      case 'automation':
        return { time: '22:15', label: 'Automation Mode', progress: 26, icon: null, showIcon: false };
      default:
        return { time: '00:00', label: 'Focus Time', progress: 0, icon: null, showIcon: false };
    }
  };

  const { time, label, progress, icon: StateIcon, showIcon } = getStateValues();

  // Progress circle calculations
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const presets = [
    { duration: '15m', label: '15 min' },
    { duration: '30m', label: '30 min' },
    { duration: '60m', label: '60 min' },
  ];

  // Mock stats based on state
  const stats = {
    sessions: state === 'completed' ? 4 : 3,
    totalTime: state === 'completed' ? '2h 15m' : '1h 45m',
  };

  return (
    <div className="inline-block">
      {/* Widget Container - iOS standard large widget size */}
      <div
        className={`${widgetBg} ${widgetShadow} rounded-[20px] p-5 w-[360px] h-[382px] flex flex-col relative overflow-hidden transition-all duration-300`}
        style={{ boxShadow: isLight ? '0 2px 10px rgba(0,0,0,0.1)' : '0 2px 20px rgba(0,0,0,0.5)' }}
      >
        {/* Top Section - Current Timer */}
        <div className="flex items-center justify-center py-4">
          <div className="flex flex-col items-center">
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
                {showIcon && StateIcon ? (
                  <StateIcon
                    size={44}
                    className={primaryText}
                    fill={state === 'completed' ? (isLight ? '#000' : '#fff') : 'none'}
                    strokeWidth={2}
                    style={{ opacity: state === 'paused' ? 0.7 : 1 }}
                  />
                ) : (
                  <>
                    <div
                      className={`${primaryText} tabular-nums`}
                      style={{
                        fontSize: '40px',
                        fontWeight: '600',
                        lineHeight: '1',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-1px',
                        opacity: state === 'paused' ? 0.7 : 1,
                      }}
                    >
                      {time}
                    </div>
                    <div
                      className={secondaryText}
                      style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        marginTop: '6px',
                        opacity: state === 'paused' ? 0.7 : 1,
                      }}
                    >
                      {progress}% complete
                    </div>
                  </>
                )}
              </div>

              {/* Automation indicator */}
              {state === 'automation' && (
                <div className="absolute top-0 right-0">
                  <div className={`${buttonBg} rounded-full p-2`}>
                    <Zap size={14} className={isLight ? 'text-gray-900' : 'text-white'} fill={isLight ? '#000' : '#fff'} />
                  </div>
                </div>
              )}
            </div>

            {/* Label */}
            <div
              className={primaryText}
              style={{
                fontSize: '15px',
                fontWeight: '600',
                opacity: state === 'paused' ? 0.7 : 1,
              }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px my-3"
          style={{ backgroundColor: isLight ? '#e5e7eb' : '#374151' }}
        />

        {/* Middle Section - Today's Stats */}
        <div className="py-2">
          <div
            className={secondaryText}
            style={{
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}
          >
            Today's Focus
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Sessions stat */}
            <div className={`${statBg} rounded-xl p-3 flex items-center gap-3`}>
              <div className={`${buttonBg} rounded-lg p-2`}>
                <CheckCircle2 size={18} className={secondaryText} />
              </div>
              <div>
                <div
                  className={primaryText}
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    lineHeight: '1',
                  }}
                >
                  {stats.sessions}
                </div>
                <div
                  className={tertiaryText}
                  style={{
                    fontSize: '10px',
                    fontWeight: '500',
                    marginTop: '2px',
                  }}
                >
                  Sessions
                </div>
              </div>
            </div>

            {/* Total time stat */}
            <div className={`${statBg} rounded-xl p-3 flex items-center gap-3`}>
              <div className={`${buttonBg} rounded-lg p-2`}>
                <Clock size={18} className={secondaryText} />
              </div>
              <div>
                <div
                  className={primaryText}
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    lineHeight: '1',
                  }}
                >
                  {stats.totalTime}
                </div>
                <div
                  className={tertiaryText}
                  style={{
                    fontSize: '10px',
                    fontWeight: '500',
                    marginTop: '2px',
                  }}
                >
                  Total Time
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px my-3"
          style={{ backgroundColor: isLight ? '#e5e7eb' : '#374151' }}
        />

        {/* Bottom Section - Quick Actions */}
        <div className="flex-1 flex flex-col">
          <div
            className={secondaryText}
            style={{
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}
          >
            Quick Start
          </div>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.duration}
                className={`${buttonBg} ${buttonBorder} border rounded-xl px-3 py-4 transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-2`}
                style={{ cursor: 'pointer' }}
              >
                <Play
                  size={20}
                  className={secondaryText}
                  fill={isLight ? '#6b7280' : '#9ca3af'}
                />
                <span
                  className={primaryText}
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
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
      <div className="mt-4 space-y-1" style={{ fontSize: '12px' }}>
        <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Tap timer → Open active timer
        </p>
        <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Tap stats → View history & statistics
        </p>
        <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Tap preset → Start new timer
        </p>
      </div>
    </div>
  );
}
