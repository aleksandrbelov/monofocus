import { Play, Pause, CheckCircle2, Zap, Target, Clock } from 'lucide-react';

type WidgetState = 'idle' | 'active' | 'paused' | 'completed' | 'automation';
type ColorMode = 'light' | 'dark';

interface LargeWidgetV2Props {
  state: WidgetState;
  colorMode: ColorMode;
}

export function LargeWidgetV2({ state, colorMode }: LargeWidgetV2Props) {
  const isLight = colorMode === 'light';

  // iOS Semantic Colors
  const widgetBg = isLight ? '#FFFFFF' : '#1C1C1E';
  const primaryText = isLight ? '#000000' : '#FFFFFF';
  const secondaryText = isLight ? '#3C3C43' : '#AEAEB2';
  const tertiaryText = isLight ? '#3C3C4399' : '#AEAEB266';
  const progressTrack = isLight ? '#E5E5EA' : '#2C2C2E';
  const accentColor = isLight ? '#007AFF' : '#0A84FF';
  const cardBg = isLight ? '#F2F2F7' : '#2C2C2E';
  
  // State-specific values
  const getStateValues = () => {
    switch (state) {
      case 'idle':
        return { time: '00:00', label: 'No Active Timer', progress: 0, icon: Play, showIcon: true, subtitle: 'Tap to start focus session' };
      case 'active':
        return { time: '15:00', label: 'Deep Focus', progress: 50, icon: null, showIcon: false, subtitle: 'Ends at 3:45 PM' };
      case 'paused':
        return { time: '08:30', label: 'Timer Paused', progress: 72, icon: Pause, showIcon: false, subtitle: 'Resume when ready' };
      case 'completed':
        return { time: '30:00', label: 'Session Complete!', progress: 100, icon: CheckCircle2, showIcon: true, subtitle: 'Great focus!' };
      case 'automation':
        return { time: '22:15', label: 'Focus Time', progress: 26, icon: null, showIcon: false, subtitle: 'Automation active' };
      default:
        return { time: '00:00', label: 'Focus', progress: 0, icon: null, showIcon: false, subtitle: '' };
    }
  };

  const { time, label, progress, icon: StateIcon, showIcon, subtitle } = getStateValues();

  // Progress circle - larger for large widget
  const size = 140;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const isDashed = state === 'paused';
  const dashArray = isDashed ? '10 5' : undefined;

  // Stats based on state
  const stats = {
    sessions: state === 'completed' ? 4 : 3,
    totalMinutes: state === 'completed' ? 135 : 105,
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="inline-block">
      {/* Widget Container - iOS exact dimensions: 338×354pt */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '338px',
          height: '354px',
          backgroundColor: widgetBg,
          borderRadius: '20px',
          padding: '20px', // Larger padding for large widget
          boxShadow: isLight 
            ? '0 1px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)' 
            : '0 1px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Automation badge */}
        {state === 'automation' && (
          <div 
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: accentColor,
              borderRadius: '12px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Zap size={11} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFFFFF', lineHeight: '1' }}>
              AUTO
            </span>
          </div>
        )}

        {/* TOP: Timer Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '8px', paddingBottom: '16px' }}>
          <div className="flex flex-col items-center">
            {/* Progress Ring */}
            <div className="relative" style={{ marginBottom: '12px' }}>
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
                    size={48}
                    color={state === 'completed' ? '#34C759' : primaryText}
                    fill={state === 'completed' ? '#34C759' : 'none'}
                    strokeWidth={2}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: '34px', // iOS .largeTitle
                        fontWeight: '700',
                        lineHeight: '41px',
                        letterSpacing: '-0.41px',
                        color: primaryText,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {time}
                    </div>
                    {state === 'paused' && (
                      <div style={{ marginTop: '4px' }}>
                        <Pause size={20} color={secondaryText} strokeWidth={2} />
                      </div>
                    )}
                    {!showIcon && progress > 0 && (
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: '500',
                          lineHeight: '20px',
                          letterSpacing: '-0.24px',
                          color: tertiaryText,
                          marginTop: '4px',
                        }}
                      >
                        {progress}%
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Label - iOS Headline */}
            <div
              style={{
                fontSize: '17px',
                fontWeight: state === 'completed' ? '600' : '600',
                lineHeight: '22px',
                letterSpacing: '-0.41px',
                color: state === 'completed' ? '#34C759' : primaryText,
                textAlign: 'center',
              }}
            >
              {label}
            </div>

            {subtitle && (
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '400',
                  lineHeight: '18px',
                  letterSpacing: '-0.08px',
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

        {/* MIDDLE: Today's Stats - Removed dividers, using spacing */}
        <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              lineHeight: '13px',
              letterSpacing: '0.06px',
              color: tertiaryText,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Today&apos;s Progress
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {/* Sessions */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: isLight ? '#E5E5EA' : '#3A3A3C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Target size={16} color={accentColor} strokeWidth={2} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      lineHeight: '29px',
                      letterSpacing: '-0.41px',
                      color: primaryText,
                    }}
                  >
                    {stats.sessions}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '400',
                  lineHeight: '18px',
                  letterSpacing: '-0.08px',
                  color: tertiaryText,
                }}
              >
                Sessions
              </div>
            </div>

            {/* Total Time */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: isLight ? '#E5E5EA' : '#3A3A3C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock size={16} color={accentColor} strokeWidth={2} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      lineHeight: '29px',
                      letterSpacing: '-0.41px',
                      color: primaryText,
                    }}
                  >
                    {formatTime(stats.totalMinutes).split(' ')[0]}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '400',
                  lineHeight: '18px',
                  letterSpacing: '-0.08px',
                  color: tertiaryText,
                }}
              >
                Focus Time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Annotation */}
      <div className="mt-4 space-y-1">
        <p style={{ fontSize: '12px', color: secondaryText }}>
          Tap timer → Open active session
        </p>
        <p style={{ fontSize: '12px', color: secondaryText }}>
          Tap stats → View detailed history
        </p>
      </div>
    </div>
  );
}
