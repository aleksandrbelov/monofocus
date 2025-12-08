interface AppIconProps {
  variant: 'primary' | 'minimal' | 'gradient' | 'dark' | 'light' | 'progress' | 'ring' | 'mono' | 'sunset' | 'forest' | 'ocean' | 'midnight';
  size?: number;
  showLabel?: boolean;
}

export function AppIcon({ variant, size = 180, showLabel = false }: AppIconProps) {
  const cornerRadius = size * 0.225; // iOS 22.5% corner radius

  const renderIcon = () => {
    switch (variant) {
      case 'primary':
        // Classic iOS Blue with progress ring
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle background pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)',
              }}
            />
            
            {/* Progress ring */}
            <svg width={size * 0.65} height={size * 0.65} style={{ position: 'relative' }}>
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
            </svg>
          </div>
        );

      case 'minimal':
        // Black & White minimal design
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width={size * 0.5} height={size * 0.5}>
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
            </svg>
          </div>
        );

      case 'gradient':
        // Colorful gradient with ring
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              }}
            />
            <svg width={size * 0.7} height={size * 0.7}>
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
            </svg>
          </div>
        );

      case 'dark':
        // Dark theme with subtle accent
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -size * 0.2,
                right: -size * 0.2,
                width: size * 0.6,
                height: size * 0.6,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)',
              }}
            />
            <svg width={size * 0.6} height={size * 0.6}>
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
            </svg>
          </div>
        );

      case 'light':
        // Light theme with soft colors
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
            }}
          >
            <svg width={size * 0.6} height={size * 0.6}>
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
            </svg>
          </div>
        );

      case 'progress':
        // Multiple rings showing progress
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #0A84FF 0%, #005BBB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
              }}
            />
            <svg width={size * 0.75} height={size * 0.75}>
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
            </svg>
          </div>
        );

      case 'ring':
        // Simple bold ring
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #000000 0%, #1C1C1E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: size * 0.65,
                height: size * 0.65,
                borderRadius: '50%',
                border: `${size * 0.08}px solid white`,
                position: 'relative',
              }}
            >
              {/* Small indicator dot */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: size * 0.12,
                  height: size * 0.12,
                  borderRadius: '50%',
                  background: 'white',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>
        );

      case 'mono':
        // Monochrome sophisticated
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: '#1C1C1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            <svg width={size * 0.65} height={size * 0.65}>
              <defs>
                <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                </linearGradient>
              </defs>
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
                stroke="url(#monoGrad)"
                strokeWidth={size * 0.06}
                strokeDasharray={`${size * 0.24 * Math.PI * 1.3} ${size * 0.24 * Math.PI * 0.7}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size * 0.325} ${size * 0.325})`}
              />
            </svg>
          </div>
        );

      case 'sunset':
        // Warm sunset gradient
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFBB5C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)',
              }}
            />
            <svg width={size * 0.6} height={size * 0.6}>
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
            </svg>
          </div>
        );

      case 'forest':
        // Green nature theme
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              }}
            />
            <svg width={size * 0.6} height={size * 0.6}>
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
            </svg>
          </div>
        );

      case 'ocean':
        // Cool ocean gradient
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)',
              }}
            />
            <svg width={size * 0.6} height={size * 0.6}>
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
            </svg>
          </div>
        );

      case 'midnight':
        // Deep midnight blue
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: cornerRadius,
              background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: size * 0.15,
                right: size * 0.15,
                width: size * 0.08,
                height: size * 0.08,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.6)',
                boxShadow: '0 0 20px rgba(255,255,255,0.3)',
              }}
            />
            <svg width={size * 0.6} height={size * 0.6}>
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
            </svg>
          </div>
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
      {renderIcon()}
      {showLabel && (
        <div style={{ fontSize: '13px', fontWeight: '500', color: '#8E8E93' }}>
          {getLabel()}
        </div>
      )}
    </div>
  );
}
