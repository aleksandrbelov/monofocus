import { Play, Pause, Square, Zap } from 'lucide-react';

type ActivityState = 'active' | 'paused';
type ColorMode = 'light' | 'dark';
type ViewType = 'compact' | 'expanded';

interface LiveActivityProps {
  state: ActivityState;
  colorMode: ColorMode;
  viewType: ViewType;
  timeRemaining: string;
  progress: number;
  sessionType?: string;
  isAutomation?: boolean;
}

export function LiveActivity({ 
  state, 
  colorMode, 
  viewType,
  timeRemaining,
  progress,
  sessionType = 'Deep Focus',
  isAutomation = false,
}: LiveActivityProps) {
  const isLight = colorMode === 'light';

  // iOS Live Activity colors (with blur/vibrancy)
  const bgColor = isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(28, 28, 30, 0.85)';
  const primaryText = isLight ? '#000000' : '#FFFFFF';
  const secondaryText = isLight ? '#3C3C43' : '#AEAEB2';
  const tertiaryText = isLight ? '#3C3C4399' : '#AEAEB266';
  const accentColor = isLight ? '#007AFF' : '#0A84FF';
  const pausedColor = isLight ? '#FF9500' : '#FF9F0A';
  const progressTrack = isLight ? '#E5E5EA' : '#2C2C2E';

  if (viewType === 'compact') {
    return (
      <div className="inline-block">
        {/* Compact Lock Screen View */}
        <div
          style={{
            width: '360px',
            backgroundColor: bgColor,
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '16px',
            boxShadow: isLight 
              ? '0 2px 8px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)' 
              : '0 2px 8px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Progress Ring - Small */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width={44} height={44} className="transform -rotate-90">
                <circle
                  cx={22}
                  cy={22}
                  r={18}
                  fill="none"
                  stroke={progressTrack}
                  strokeWidth={4}
                />
                <circle
                  cx={22}
                  cy={22}
                  r={18}
                  fill="none"
                  stroke={state === 'paused' ? pausedColor : accentColor}
                  strokeWidth={4}
                  strokeDasharray={state === 'paused' ? '6 3' : `${2 * Math.PI * 18}`}
                  strokeDashoffset={2 * Math.PI * 18 * (1 - progress / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {state === 'paused' ? (
                  <Pause size={16} color={pausedColor} strokeWidth={2.5} />
                ) : null}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    lineHeight: '20px',
                    letterSpacing: '-0.24px',
                    color: primaryText,
                  }}
                >
                  MonoFocus
                </span>
                {isAutomation && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      backgroundColor: accentColor,
                      borderRadius: '6px',
                      padding: '2px 4px',
                    }}
                  >
                    <Zap size={8} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
                    <span style={{ fontSize: '9px', fontWeight: '600', color: '#FFFFFF', lineHeight: '1' }}>
                      AUTO
                    </span>
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '400',
                  lineHeight: '18px',
                  letterSpacing: '-0.08px',
                  color: secondaryText,
                }}
              >
                {sessionType} • {state === 'paused' ? 'Paused' : 'In Progress'}
              </div>
            </div>

            {/* Time Remaining */}
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  lineHeight: '24px',
                  letterSpacing: '-0.45px',
                  color: primaryText,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {timeRemaining}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '400',
                  lineHeight: '13px',
                  color: tertiaryText,
                }}
              >
                remaining
              </div>
            </div>
          </div>
        </div>

        {/* Annotation */}
        <div className="mt-3 text-center">
          <p style={{ fontSize: '11px', color: secondaryText }}>
            Lock Screen - Compact View
          </p>
        </div>
      </div>
    );
  }

  // Expanded View
  return (
    <div className="inline-block">
      {/* Expanded Lock Screen View */}
      <div
        style={{
          width: '360px',
          backgroundColor: bgColor,
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: isLight 
            ? '0 2px 8px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)' 
            : '0 2px 8px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: '600',
                lineHeight: '20px',
                letterSpacing: '-0.24px',
                color: primaryText,
              }}
            >
              MonoFocus
            </span>
            {isAutomation && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  backgroundColor: accentColor,
                  borderRadius: '8px',
                  padding: '3px 6px',
                }}
              >
                <Zap size={9} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
                <span style={{ fontSize: '10px', fontWeight: '600', color: '#FFFFFF', lineHeight: '1' }}>
                  AUTO
                </span>
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '500',
              lineHeight: '18px',
              letterSpacing: '-0.08px',
              color: state === 'paused' ? pausedColor : accentColor,
            }}
          >
            {state === 'paused' ? 'Paused' : 'In Progress'}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
          {/* Large Progress Ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={80} height={80} className="transform -rotate-90">
              <circle
                cx={40}
                cy={40}
                r={34}
                fill="none"
                stroke={progressTrack}
                strokeWidth={6}
              />
              <circle
                cx={40}
                cy={40}
                r={34}
                fill="none"
                stroke={state === 'paused' ? pausedColor : accentColor}
                strokeWidth={6}
                strokeDasharray={state === 'paused' ? '8 4' : `${2 * Math.PI * 34}`}
                strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  lineHeight: '29px',
                  letterSpacing: '-0.45px',
                  color: primaryText,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {timeRemaining}
              </div>
              {state === 'paused' && (
                <Pause size={14} color={secondaryText} strokeWidth={2} style={{ marginTop: '2px' }} />
              )}
            </div>
          </div>

          {/* Session Info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '22px',
                fontWeight: '600',
                lineHeight: '28px',
                letterSpacing: '-0.26px',
                color: primaryText,
                marginBottom: '4px',
              }}
            >
              {sessionType}
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: '400',
                lineHeight: '20px',
                letterSpacing: '-0.24px',
                color: secondaryText,
                marginBottom: '8px',
              }}
            >
              {progress}% complete
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
              Ends at 3:45 PM
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              flex: 1,
              backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            {state === 'paused' ? (
              <>
                <Play size={16} color={primaryText} strokeWidth={2.5} fill={primaryText} />
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    lineHeight: '20px',
                    letterSpacing: '-0.24px',
                    color: primaryText,
                  }}
                >
                  Resume
                </span>
              </>
            ) : (
              <>
                <Pause size={16} color={primaryText} strokeWidth={2.5} />
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    lineHeight: '20px',
                    letterSpacing: '-0.24px',
                    color: primaryText,
                  }}
                >
                  Pause
                </span>
              </>
            )}
          </button>
          <button
            style={{
              flex: 1,
              backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Square size={16} color="#FF3B30" strokeWidth={2.5} />
            <span
              style={{
                fontSize: '15px',
                fontWeight: '600',
                lineHeight: '20px',
                letterSpacing: '-0.24px',
                color: '#FF3B30',
              }}
            >
              End
            </span>
          </button>
        </div>
      </div>

      {/* Annotation */}
      <div className="mt-3 text-center">
        <p style={{ fontSize: '11px', color: secondaryText }}>
          Lock Screen - Expanded View (Long Press)
        </p>
      </div>
    </div>
  );
}
