import { Play, Pause, CheckCircle2, Zap } from 'lucide-react';

type WidgetState = 'idle' | 'active' | 'paused' | 'completed' | 'automation';
type ColorMode = 'light' | 'dark';

interface SmallWidgetV2Props {
  state: WidgetState;
  colorMode: ColorMode;
}

export function SmallWidgetV2({ state, colorMode }: SmallWidgetV2Props) {
  const isLight = colorMode === 'light';

  // iOS Semantic Colors
  const widgetBg = isLight ? '#FFFFFF' : '#1C1C1E'; // Elevated surface, not pure black
  const primaryText = isLight ? '#000000' : '#FFFFFF';
  const secondaryText = isLight ? '#3C3C43' : '#AEAEB2'; // iOS secondaryLabel
  const tertiaryText = isLight ? '#3C3C4399' : '#AEAEB266'; // iOS tertiaryLabel
  const progressTrack = isLight ? '#E5E5EA' : '#2C2C2E'; // systemGray5/systemGray6
  const accentColor = isLight ? '#007AFF' : '#0A84FF'; // iOS blue
  
  // State-specific values
  const getStateValues = () => {
    switch (state) {
      case 'idle':
        return { time: '00:00', label: 'Tap to Start', progress: 0, icon: Play, showIcon: true, subtitle: '' };
      case 'active':
        return { time: '15:00', label: 'Deep Focus', progress: 50, icon: null, showIcon: false, subtitle: 'Ends 3:45 PM' };
      case 'paused':
        return { time: '08:30', label: 'Paused', progress: 72, icon: Pause, showIcon: false, subtitle: '' };
      case 'completed':
        return { time: '30:00', label: 'Complete!', progress: 100, icon: CheckCircle2, showIcon: true, subtitle: '30 min session' };
      case 'automation':
        return { time: '22:15', label: 'Focus Time', progress: 26, icon: null, showIcon: false, subtitle: 'Auto mode' };
      default:
        return { time: '00:00', label: 'Focus', progress: 0, icon: null, showIcon: false, subtitle: '' };
    }
  };

  const { time, label, progress, icon: StateIcon, showIcon, subtitle } = getStateValues();

  // Progress circle calculations - proper sizing
  const size = 120; // Reduced from 140 for better optical balance
  const strokeWidth = 6; // 5% ratio
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Dashed progress for paused state
  const isDashed = state === 'paused';
  const dashArray = isDashed ? '8 4' : undefined;

  return (
    <div className="inline-block">
      {/* Widget Container - iOS exact dimensions: 158×158pt */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '158px',
          height: '158px',
          backgroundColor: widgetBg,
          borderRadius: '20px',
          padding: '16px',
          boxShadow: isLight 
            ? '0 1px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)' 
            : '0 1px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {/* Automation indicator badge - consistent top-right */}
        {state === 'automation' && (
          <div 
            className="absolute"
            style={{
              top: '8px',
              right: '8px',
              backgroundColor: isLight ? accentColor : accentColor,
              borderRadius: '12px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Zap size={10} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
            <span style={{ fontSize: '10px', fontWeight: '600', color: '#FFFFFF', lineHeight: '1' }}>
              AUTO
            </span>
          </div>
        )}

        {/* Main content - centered */}
        <div className="flex items-center justify-center" style={{ height: '100%' }}>
          <div className="flex flex-col items-center">
            {/* Progress Ring */}
            <div className="relative" style={{ marginBottom: '8px' }}>
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={progressTrack}
                  strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                {progress > 0 && (
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={state === 'completed' ? '#34C759' : accentColor} // Green for completed
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray || circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 0.3s ease',
                    }}
                  />
                )}
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {showIcon && StateIcon ? (
                  <StateIcon
                    size={36}
                    color={state === 'completed' ? '#34C759' : primaryText}
                    fill={state === 'completed' ? '#34C759' : 'none'}
                    strokeWidth={2}
                  />
                ) : (
                  <>
                    {/* Time - iOS Title style */}
                    <div
                      style={{
                        fontSize: '28px', // iOS .title (28pt)
                        fontWeight: '600',
                        lineHeight: '34px',
                        letterSpacing: '-0.26px',
                        color: primaryText,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {time}
                    </div>
                    {/* Paused indicator */}
                    {state === 'paused' && (
                      <div style={{ marginTop: '4px' }}>
                        <Pause size={16} color={secondaryText} strokeWidth={2} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Label - iOS Callout style */}
            <div
              style={{
                fontSize: '13px', // iOS .footnote
                fontWeight: state === 'completed' ? '600' : '500',
                lineHeight: '18px',
                letterSpacing: '-0.08px',
                color: state === 'completed' ? '#34C759' : secondaryText,
                textAlign: 'center',
              }}
            >
              {label}
            </div>

            {/* Subtitle - iOS Caption2 style */}
            {subtitle && (
              <div
                style={{
                  fontSize: '11px', // iOS .caption2
                  fontWeight: '400',
                  lineHeight: '13px',
                  color: tertiaryText,
                  marginTop: '2px',
                  textAlign: 'center',
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Annotation */}
      <div className="mt-4 text-center">
        <p style={{ fontSize: '12px', color: secondaryText }}>
          Tap widget → Open app
        </p>
      </div>
    </div>
  );
}
