import { Play, Pause, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

type WidgetState = 'idle' | 'active' | 'paused' | 'completed' | 'automation';
type ColorMode = 'light' | 'dark';

interface MediumWidgetV2Props {
  state: WidgetState;
  colorMode: ColorMode;
}

export function MediumWidgetV2({ state, colorMode }: MediumWidgetV2Props) {
  const isLight = colorMode === 'light';

  // iOS Semantic Colors
  const widgetBg = isLight ? '#FFFFFF' : '#1C1C1E';
  const primaryText = isLight ? '#000000' : '#FFFFFF';
  const secondaryText = isLight ? '#3C3C43' : '#AEAEB2';
  const tertiaryText = isLight ? '#3C3C4399' : '#AEAEB266';
  const progressTrack = isLight ? '#E5E5EA' : '#2C2C2E';
  const accentColor = isLight ? '#007AFF' : '#0A84FF';
  const cardBg = isLight ? '#F2F2F7' : '#2C2C2E'; // systemGray6/systemGray5
  
  // State-specific values
  const getStateValues = () => {
    switch (state) {
      case 'idle':
        return { time: '00:00', label: 'Start Focus', progress: 0, icon: Play, showIcon: true, subtitle: 'Choose duration' };
      case 'active':
        return { time: '15:00', label: 'Deep Focus', progress: 50, icon: null, showIcon: false, subtitle: 'Ends 3:45 PM' };
      case 'paused':
        return { time: '08:30', label: 'Timer Paused', progress: 72, icon: Pause, showIcon: false, subtitle: 'Tap to resume' };
      case 'completed':
        return { time: '30:00', label: 'Well Done!', progress: 100, icon: CheckCircle2, showIcon: true, subtitle: '30 min session' };
      case 'automation':
        return { time: '22:15', label: 'Focus Time', progress: 26, icon: null, showIcon: false, subtitle: 'Auto mode active' };
      default:
        return { time: '00:00', label: 'Focus', progress: 0, icon: null, showIcon: false, subtitle: '' };
    }
  };

  const { time, label, progress, icon: StateIcon, showIcon, subtitle } = getStateValues();

  // Progress circle - smaller for medium widget
  const size = 88; // Reduced for better proportion
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const isDashed = state === 'paused';
  const dashArray = isDashed ? '6 3' : undefined;

  // Simplified presets - displayed as info cards, not buttons
  const presets = [
    { label: '15', unit: 'min' },
    { label: '30', unit: 'min' },
    { label: '60', unit: 'min' },
  ];

  return (
    <div className="inline-block">
      {/* Widget Container - iOS exact dimensions: 338×158pt */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '338px',
          height: '158px',
          backgroundColor: widgetBg,
          borderRadius: '20px',
          padding: '16px',
          boxShadow: isLight 
            ? '0 1px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)' 
            : '0 1px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          gap: '12px',
        }}
      >
        {/* LEFT: Timer Section (60% width) */}
        <div style={{ flex: '0 0 60%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="flex flex-col items-center">
            {/* Automation badge */}
            {state === 'automation' && (
              <div 
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  backgroundColor: accentColor,
                  borderRadius: '10px',
                  padding: '3px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Zap size={9} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
                <span style={{ fontSize: '9px', fontWeight: '600', color: '#FFFFFF', lineHeight: '1' }}>
                  AUTO
                </span>
              </div>
            )}

            {/* Progress Ring */}
            <div className="relative" style={{ marginBottom: '8px' }}>
              <svg width={size} height={size} className="transform -rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={progressTrack}
                  strokeWidth={strokeWidth}
                />
                {progress > 0 && (
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={state === 'completed' ? '#34C759' : accentColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray || circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {showIcon && StateIcon ? (
                  <StateIcon
                    size={28}
                    color={state === 'completed' ? '#34C759' : primaryText}
                    fill={state === 'completed' ? '#34C759' : 'none'}
                    strokeWidth={2}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: '22px', // iOS .title2
                        fontWeight: '600',
                        lineHeight: '28px',
                        letterSpacing: '-0.26px',
                        color: primaryText,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {time}
                    </div>
                    {state === 'paused' && (
                      <div style={{ marginTop: '2px' }}>
                        <Pause size={14} color={secondaryText} strokeWidth={2} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: '13px',
                fontWeight: state === 'completed' ? '600' : '500',
                lineHeight: '18px',
                letterSpacing: '-0.08px',
                color: state === 'completed' ? '#34C759' : secondaryText,
                textAlign: 'center',
              }}
            >
              {label}
            </div>

            {subtitle && (
              <div
                style={{
                  fontSize: '11px',
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

        {/* RIGHT: Quick Start Section (35% width) */}
        <div style={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
          {/* Section label */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              lineHeight: '13px',
              letterSpacing: '0.06px',
              color: tertiaryText,
              textTransform: 'uppercase',
            }}
          >
            Quick Start
          </div>

          {/* Preset cards - simplified, not button-styled */}
          {presets.map((preset, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: cardBg,
                borderRadius: '10px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span
                  style={{
                    fontSize: '17px', // iOS .body
                    fontWeight: '600',
                    lineHeight: '22px',
                    letterSpacing: '-0.41px',
                    color: primaryText,
                  }}
                >
                  {preset.label}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '400',
                    lineHeight: '18px',
                    color: secondaryText,
                  }}
                >
                  {preset.unit}
                </span>
              </div>
              <ArrowRight size={14} color={tertiaryText} strokeWidth={2} />
            </div>
          ))}
        </div>
      </div>

      {/* Annotation - simplified */}
      <div className="mt-4 text-center">
        <p style={{ fontSize: '12px', color: secondaryText }}>
          Tap left → Active timer • Tap right → Start preset
        </p>
      </div>
    </div>
  );
}
