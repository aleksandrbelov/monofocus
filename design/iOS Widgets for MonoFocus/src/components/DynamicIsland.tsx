import { Play, Pause, Square, Zap } from 'lucide-react';

type IslandState = 'active' | 'paused';
type ColorMode = 'light' | 'dark';
type IslandSize = 'minimal' | 'compact' | 'expanded';

interface DynamicIslandProps {
  state: IslandState;
  colorMode: ColorMode;
  size: IslandSize;
  timeRemaining: string;
  progress: number;
  sessionType?: string;
  isAutomation?: boolean;
}

export function DynamicIsland({
  state,
  colorMode,
  size,
  timeRemaining,
  progress,
  sessionType = 'Deep Focus',
  isAutomation = false,
}: DynamicIslandProps) {
  // Dynamic Island always has dark background regardless of system mode
  const bgColor = '#000000';
  const primaryText = '#FFFFFF';
  const secondaryText = '#AEAEB2';
  const tertiaryText = '#8E8E93';
  const accentColor = '#0A84FF';
  const pausedColor = '#FF9F0A';
  const progressTrack = '#2C2C2E';

  // Minimal State - Just a dot or small indicator
  if (size === 'minimal') {
    return (
      <div className="inline-block">
        <div
          style={{
            width: '130px',
            height: '37px',
            backgroundColor: bgColor,
            borderRadius: '19px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Minimal progress bar at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              width: `${progress}%`,
              backgroundColor: state === 'paused' ? pausedColor : accentColor,
              transition: 'width 0.3s ease',
            }}
          />

          {/* Small icon */}
          {state === 'paused' ? (
            <Pause size={14} color={pausedColor} strokeWidth={2.5} />
          ) : (
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          )}
        </div>

        <div className="mt-3 text-center">
          <p style={{ fontSize: '11px', color: colorMode === 'light' ? '#3C3C43' : '#AEAEB2' }}>
            Dynamic Island - Minimal
          </p>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // Compact State - Leading icon + trailing content
  if (size === 'compact') {
    return (
      <div className="inline-block">
        <div
          style={{
            width: '250px',
            height: '37px',
            backgroundColor: bgColor,
            borderRadius: '19px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px 0 8px',
            gap: '8px',
            position: 'relative',
          }}
        >
          {/* Leading - Progress circle with icon */}
          <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
            <svg width={24} height={24} className="transform -rotate-90">
              <circle
                cx={12}
                cy={12}
                r={10}
                fill="none"
                stroke={progressTrack}
                strokeWidth={2}
              />
              <circle
                cx={12}
                cy={12}
                r={10}
                fill="none"
                stroke={state === 'paused' ? pausedColor : accentColor}
                strokeWidth={2}
                strokeDasharray={state === 'paused' ? '4 2' : `${2 * Math.PI * 10}`}
                strokeDashoffset={2 * Math.PI * 10 * (1 - progress / 100)}
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
                <Pause size={10} color={pausedColor} strokeWidth={2.5} />
              ) : (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: accentColor,
                  }}
                />
              )}
            </div>
          </div>

          {/* Center - Session label */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                lineHeight: '16px',
                letterSpacing: '-0.08px',
                color: primaryText,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {state === 'paused' ? 'Paused' : 'Focus'}
            </div>
          </div>

          {/* Trailing - Time */}
          <div
            style={{
              fontSize: '15px',
              fontWeight: '600',
              lineHeight: '18px',
              letterSpacing: '-0.24px',
              color: primaryText,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {timeRemaining}
          </div>

          {/* Automation indicator */}
          {isAutomation && (
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: accentColor, marginLeft: '-4px' }} />
          )}
        </div>

        <div className="mt-3 text-center">
          <p style={{ fontSize: '11px', color: colorMode === 'light' ? '#3C3C43' : '#AEAEB2' }}>
            Dynamic Island - Compact (Other activity running)
          </p>
        </div>
      </div>
    );
  }

  // Expanded State - Full interface
  return (
    <div className="inline-block">
      <div
        style={{
          width: '360px',
          backgroundColor: bgColor,
          borderRadius: '44px',
          padding: '20px 24px 24px',
          position: 'relative',
        }}
      >
        {/* Top section with progress ring */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {/* Progress Ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={64} height={64} className="transform -rotate-90">
              <circle
                cx={32}
                cy={32}
                r={28}
                fill="none"
                stroke={progressTrack}
                strokeWidth={4}
              />
              <circle
                cx={32}
                cy={32}
                r={28}
                fill="none"
                stroke={state === 'paused' ? pausedColor : accentColor}
                strokeWidth={4}
                strokeDasharray={state === 'paused' ? '6 3' : `${2 * Math.PI * 28}`}
                strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
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
                  fontSize: '17px',
                  fontWeight: '600',
                  lineHeight: '22px',
                  letterSpacing: '-0.41px',
                  color: primaryText,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {timeRemaining}
              </div>
            </div>
          </div>

          {/* Session info */}
          <div style={{ flex: 1, paddingTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: '600',
                  lineHeight: '22px',
                  letterSpacing: '-0.41px',
                  color: primaryText,
                }}
              >
                {sessionType}
              </div>
              {isAutomation && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    backgroundColor: 'rgba(10, 132, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '2px 5px',
                  }}
                >
                  <Zap size={8} color={accentColor} fill={accentColor} strokeWidth={2} />
                  <span style={{ fontSize: '9px', fontWeight: '600', color: accentColor, lineHeight: '1' }}>
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
                marginBottom: '2px',
              }}
            >
              {state === 'paused' ? 'Paused' : 'In Progress'}
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
              {progress}% • Ends 3:45 PM
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '4px',
            backgroundColor: progressTrack,
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: state === 'paused' ? pausedColor : accentColor,
              transition: 'width 0.3s ease',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '16px',
              padding: '14px',
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
              backgroundColor: 'rgba(255, 59, 48, 0.2)',
              border: 'none',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Square size={16} color="#FF453A" strokeWidth={2.5} />
            <span
              style={{
                fontSize: '15px',
                fontWeight: '600',
                lineHeight: '20px',
                letterSpacing: '-0.24px',
                color: '#FF453A',
              }}
            >
              End Session
            </span>
          </button>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p style={{ fontSize: '11px', color: colorMode === 'light' ? '#3C3C43' : '#AEAEB2' }}>
          Dynamic Island - Expanded (Long Press or Tap)
        </p>
      </div>
    </div>
  );
}
