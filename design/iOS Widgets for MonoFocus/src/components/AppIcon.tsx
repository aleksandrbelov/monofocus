import React from 'react';

interface AppIconProps {
  variant: 'primary' | 'minimal' | 'gradient' | 'dark' | 'light' | 'progress' | 'ring' | 'mono' | 'sunset' | 'forest' | 'ocean' | 'midnight';
  size?: number;
  showLabel?: boolean;
  square?: boolean;
}

export function AppIcon({ variant, size = 180, showLabel = false, square = false }: AppIconProps) {
  const cornerRadius = square ? 0 : size * 0.225; // iOS 22.5% corner radius or 0 for square export
  const uniqueId = `icon-${variant}-${Math.random().toString(36).substr(2, 9)}`;

  const renderIconContent = () => {
    switch (variant) {
      case 'primary':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#007AFF" />
                <stop offset="100%" stopColor="#0051D5" />
              </linearGradient>
              <radialGradient id={`${uniqueId}-glow`} cx="30%" cy="30%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-glow)`} />

            <g transform={`translate(${size * 0.175}, ${size * 0.175})`}>
              <circle
                cx={size * 0.325}
                cy={size * 0.325}
                r={size * 0.25}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={size * 0.055}
              />
              <circle
                cx={size * 0.325}
                cy={size * 0.325}
                r={size * 0.25}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.055}
                strokeDasharray={`${size * 0.25 * Math.PI * 1.5} ${size * 0.25 * Math.PI * 0.5}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.325} ${size * 0.325})`}
              />
            </g>
          </>
        );

      case 'minimal':
        return (
          <>
            <rect width={size} height={size} rx={cornerRadius} fill="#000000" />
            <g transform={`translate(${size * 0.25}, ${size * 0.25})`}>
              <circle
                cx={size * 0.25}
                cy={size * 0.25}
                r={size * 0.18}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.045}
              />
              <circle
                cx={size * 0.25}
                cy={size * 0.25}
                r={size * 0.18}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.045}
                strokeDasharray={`${size * 0.18 * Math.PI * 1.3} ${size * 0.18 * Math.PI * 0.7}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.25} ${size * 0.25})`}
                opacity="0.3"
              />
            </g>
          </>
        );

      case 'gradient':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
              <radialGradient id={`${uniqueId}-glow`} cx="70%" cy="20%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-glow)`} />

            <g transform={`translate(${size * 0.15}, ${size * 0.15})`}>
              <circle
                cx={size * 0.35}
                cy={size * 0.35}
                r={size * 0.27}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={size * 0.04}
              />
              <circle
                cx={size * 0.35}
                cy={size * 0.35}
                r={size * 0.27}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.04}
                strokeDasharray={`${size * 0.27 * Math.PI * 1.4} ${size * 0.27 * Math.PI * 0.6}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.35} ${size * 0.35})`}
              />
            </g>
          </>
        );

      case 'dark':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C1C1E" />
                <stop offset="100%" stopColor="#2C2C2E" />
              </linearGradient>
              <radialGradient id={`${uniqueId}-orb`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0,122,255,0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />

            {/* Orb effect - translated from CSS top/right negative positioning */}
            <circle cx={size * 0.8} cy={size * 0.2} r={size * 0.3} fill={`url(#${uniqueId}-orb)`} />

            <g transform={`translate(${size * 0.2}, ${size * 0.2})`}>
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={size * 0.05}
              />
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="#0A84FF"
                strokeWidth={size * 0.05}
                strokeDasharray={`${size * 0.22 * Math.PI * 1.5} ${size * 0.22 * Math.PI * 0.5}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.3} ${size * 0.3})`}
              />
            </g>
          </>
        );

      case 'light':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F5F5F7" />
              </linearGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />
            {/* Inner Border sim using stroke */}
            <rect width={size} height={size} rx={cornerRadius} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={1} inset={1} />

            <g transform={`translate(${size * 0.2}, ${size * 0.2})`}>
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth={size * 0.05}
              />
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="#007AFF"
                strokeWidth={size * 0.05}
                strokeDasharray={`${size * 0.22 * Math.PI * 1.5} ${size * 0.22 * Math.PI * 0.5}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.3} ${size * 0.3})`}
              />
            </g>
          </>
        );

      case 'progress':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A84FF" />
                <stop offset="100%" stopColor="#005BBB" />
              </linearGradient>
              <radialGradient id={`${uniqueId}-glow`} cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-glow)`} />

            <g transform={`translate(${size * 0.125}, ${size * 0.125})`}>
              {/* Outer ring - 75% */}
              <circle
                cx={size * 0.375}
                cy={size * 0.375}
                r={size * 0.28}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={size * 0.03}
              />
              <circle
                cx={size * 0.375}
                cy={size * 0.375}
                r={size * 0.28}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.03}
                strokeDasharray={`${size * 0.28 * Math.PI * 1.5} ${size * 0.28 * Math.PI * 0.5}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.375} ${size * 0.375})`}
              />
              {/* Middle ring - 50% */}
              <circle
                cx={size * 0.375}
                cy={size * 0.375}
                r={size * 0.21}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={size * 0.03}
              />
              <circle
                cx={size * 0.375}
                cy={size * 0.375}
                r={size * 0.21}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.03}
                strokeDasharray={`${size * 0.21 * Math.PI * 1} ${size * 0.21 * Math.PI * 1}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.375} ${size * 0.375})`}
                opacity="0.7"
              />
              {/* Inner ring - 25% */}
              <circle
                cx={size * 0.375}
                cy={size * 0.375}
                r={size * 0.14}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={size * 0.03}
              />
              <circle
                cx={size * 0.375}
                cy={size * 0.375}
                r={size * 0.14}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.03}
                strokeDasharray={`${size * 0.14 * Math.PI * 0.5} ${size * 0.14 * Math.PI * 1.5}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.375} ${size * 0.375})`}
                opacity="0.5"
              />
            </g>
          </>
        );

      case 'ring':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1C1C1E" />
              </linearGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />

            {/* Central elements, manually centered */}
            <circle cx={size * 0.5} cy={size * 0.5} r={size * 0.325} fill="none" stroke="white" strokeWidth={size * 0.08} />
            <circle cx={size * 0.5} cy={size * 0.5} r={size * 0.06} fill="white" />
          </>
        );

      case 'mono':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-monoGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
              </linearGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill="#1C1C1E" />
            {/* Inner border sim */}
            <rect width={size} height={size} rx={cornerRadius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

            <g transform={`translate(${size * 0.175}, ${size * 0.175})`}>
              <circle
                cx={size * 0.325}
                cy={size * 0.325}
                r={size * 0.24}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={size * 0.06}
              />
              <circle
                cx={size * 0.325}
                cy={size * 0.325}
                r={size * 0.24}
                fill="none"
                stroke={`url(#${uniqueId}-monoGrad)`}
                strokeWidth={size * 0.06}
                strokeDasharray={`${size * 0.24 * Math.PI * 1.3} ${size * 0.24 * Math.PI * 0.7}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.325} ${size * 0.325})`}
              />
            </g>
          </>
        );

      case 'sunset':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="50%" stopColor="#FF8E53" />
                <stop offset="100%" stopColor="#FFBB5C" />
              </linearGradient>
              <radialGradient id={`${uniqueId}-glow`} cx="30%" cy="30%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-glow)`} />

            <g transform={`translate(${size * 0.2}, ${size * 0.2})`}>
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={size * 0.05}
              />
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.05}
                strokeDasharray={`${size * 0.22 * Math.PI * 1.6} ${size * 0.22 * Math.PI * 0.4}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.3} ${size * 0.3})`}
              />
            </g>
          </>
        );

      case 'forest':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#11998e" />
                <stop offset="100%" stopColor="#38ef7d" />
              </linearGradient>
              <radialGradient id={`${uniqueId}-glow`} cx="60%" cy="40%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-glow)`} />

            <g transform={`translate(${size * 0.2}, ${size * 0.2})`}>
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={size * 0.05}
              />
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.05}
                strokeDasharray={`${size * 0.22 * Math.PI * 1.4} ${size * 0.22 * Math.PI * 0.6}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.3} ${size * 0.3})`}
              />
            </g>
          </>
        );

      case 'ocean':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E3192" />
                <stop offset="100%" stopColor="#1BFFFF" />
              </linearGradient>
              <radialGradient id={`${uniqueId}-glow`} cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-glow)`} />

            <g transform={`translate(${size * 0.2}, ${size * 0.2})`}>
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={size * 0.05}
              />
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="white"
                strokeWidth={size * 0.05}
                strokeDasharray={`${size * 0.22 * Math.PI * 1.5} ${size * 0.22 * Math.PI * 0.5}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.3} ${size * 0.3})`}
              />
            </g>
          </>
        );

      case 'midnight':
        return (
          <>
            <defs>
              <linearGradient id={`${uniqueId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F2027" />
                <stop offset="50%" stopColor="#203A43" />
                <stop offset="100%" stopColor="#2C5364" />
              </linearGradient>
            </defs>
            <rect width={size} height={size} rx={cornerRadius} fill={`url(#${uniqueId}-bg)`} />

            {/* Glow dot */}
            <circle cx={size * 0.85} cy={size * 0.15} r={size * 0.04} fill="rgba(255,255,255,0.6)" filter={`url(#${uniqueId}-blur)`} />
            <defs>
              <filter id={`${uniqueId}-blur`}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
            </defs>


            <g transform={`translate(${size * 0.2}, ${size * 0.2})`}>
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={size * 0.05}
              />
              <circle
                cx={size * 0.3}
                cy={size * 0.3}
                r={size * 0.22}
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={size * 0.05}
                strokeDasharray={`${size * 0.22 * Math.PI * 1.3} ${size * 0.22 * Math.PI * 0.7}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.3} ${size * 0.3})`}
              />
            </g>
          </>
        );

      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (variant) {
      case 'primary': return 'Primary';
      case 'minimal': return 'Minimal';
      case 'gradient': return 'Gradient';
      case 'dark': return 'Dark';
      case 'light': return 'Light';
      case 'progress': return 'Progress';
      case 'ring': return 'Ring';
      case 'mono': return 'Mono';
      case 'sunset': return 'Sunset';
      case 'forest': return 'Forest';
      case 'ocean': return 'Ocean';
      case 'midnight': return 'Midnight';
      default: return '';
    }
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }} // Remove inline-block gap
      >
        {renderIconContent()}
      </svg>
      {showLabel && (
        <div style={{ fontSize: '13px', fontWeight: '500', color: '#8E8E93' }}>
          {getLabel()}
        </div>
      )}
    </div>
  );
}
