import { useState } from 'react';
import { LiveActivity } from './LiveActivity';
import { DynamicIsland } from './DynamicIsland';
import { Info } from 'lucide-react';

type ColorMode = 'light' | 'dark';

interface LiveActivityShowcaseProps {
  colorMode: ColorMode;
}

export function LiveActivityShowcase({ colorMode }: LiveActivityShowcaseProps) {
  const [activityState, setActivityState] = useState<'active' | 'paused'>('active');
  const [isAutomation, setIsAutomation] = useState(false);
  
  const isLight = colorMode === 'light';
  const bgColor = isLight ? '#FFFFFF' : '#1C1C1E';
  const borderColor = isLight ? '#E5E5EA' : '#2C2C2E';
  const primaryText = isLight ? '#000000' : '#FFFFFF';
  const secondaryText = isLight ? '#3C3C43' : '#AEAEB2';
  const accentColor = isLight ? '#007AFF' : '#0A84FF';
  const infoBg = isLight ? '#F2F2F7' : '#2C2C2E';

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: primaryText, marginBottom: '8px' }}>
          Live Activity & Dynamic Island
        </h2>
        <p style={{ fontSize: '15px', color: secondaryText, marginBottom: '16px' }}>
          Real-time timer status on Lock Screen and Dynamic Island for iPhone 14 Pro and newer
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivityState(activityState === 'active' ? 'paused' : 'active')}
            style={{
              backgroundColor: accentColor,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Toggle: {activityState === 'active' ? 'Active' : 'Paused'}
          </button>
          <button
            onClick={() => setIsAutomation(!isAutomation)}
            style={{
              backgroundColor: isAutomation ? accentColor : infoBg,
              color: isAutomation ? '#FFFFFF' : primaryText,
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {isAutomation ? '✓ ' : ''}Automation Mode
          </button>
        </div>
      </div>

      {/* iOS Guidelines Info */}
      <div
        style={{
          backgroundColor: infoBg,
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Info size={20} color={accentColor} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: primaryText, marginBottom: '4px' }}>
            iOS Live Activity Requirements
          </div>
          <ul style={{ fontSize: '13px', color: secondaryText, lineHeight: '20px', paddingLeft: '16px', margin: 0 }}>
            <li>Updates via push notifications or app background refresh</li>
            <li>Stays active for up to 8 hours</li>
            <li>Users can dismiss by long-pressing and tapping "Remove"</li>
            <li>Dynamic Island requires iPhone 14 Pro or newer</li>
            <li>Action buttons work via deep links to app</li>
          </ul>
        </div>
      </div>

      {/* Live Activity Section */}
      <section>
        <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '16px' }}>
          Live Activity - Lock Screen
        </h3>
        
        <div className="space-y-12">
          {/* Compact View */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '4px' }}>
                Compact View
              </div>
              <p style={{ fontSize: '13px', color: secondaryText }}>
                Default collapsed state on Lock Screen. Shows progress ring, session name, and time remaining.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <LiveActivity
                state={activityState}
                colorMode={colorMode}
                viewType="compact"
                timeRemaining="15:30"
                progress={48}
                sessionType="Deep Focus"
                isAutomation={isAutomation}
              />
            </div>
          </div>

          {/* Expanded View */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '4px' }}>
                Expanded View
              </div>
              <p style={{ fontSize: '13px', color: secondaryText }}>
                Long-press the compact view to expand. Includes action buttons for Pause/Resume and End session.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <LiveActivity
                state={activityState}
                colorMode={colorMode}
                viewType="expanded"
                timeRemaining="15:30"
                progress={48}
                sessionType="Deep Focus"
                isAutomation={isAutomation}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Island Section */}
      <section>
        <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '16px' }}>
          Dynamic Island - iPhone 14 Pro+
        </h3>
        
        <div className="space-y-12">
          {/* Minimal */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '4px' }}>
                Minimal State
              </div>
              <p style={{ fontSize: '13px', color: secondaryText }}>
                Ultra-compact indicator when another Live Activity is primary. Shows progress bar and state icon.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <DynamicIsland
                state={activityState}
                colorMode={colorMode}
                size="minimal"
                timeRemaining="15:30"
                progress={48}
                sessionType="Deep Focus"
                isAutomation={isAutomation}
              />
            </div>
          </div>

          {/* Compact */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '4px' }}>
                Compact State
              </div>
              <p style={{ fontSize: '13px', color: secondaryText }}>
                Default active state. Shows progress ring, status label, and time remaining at a glance.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <DynamicIsland
                state={activityState}
                colorMode={colorMode}
                size="compact"
                timeRemaining="15:30"
                progress={48}
                sessionType="Deep Focus"
                isAutomation={isAutomation}
              />
            </div>
          </div>

          {/* Expanded */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '4px' }}>
                Expanded State
              </div>
              <p style={{ fontSize: '13px', color: secondaryText }}>
                Long-press or tap to expand. Full interface with progress ring, session details, and action buttons.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <DynamicIsland
                state={activityState}
                colorMode={colorMode}
                size="expanded"
                timeRemaining="15:30"
                progress={48}
                sessionType="Deep Focus"
                isAutomation={isAutomation}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Design Specifications */}
      <section>
        <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '16px' }}>
          Design Specifications
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <SpecCard
            title="Live Activity"
            specs={[
              'Compact: 360×84pt (typical)',
              'Expanded: 360×160pt (typical)',
              'Background: Blur material',
              'Corners: 24pt radius',
              'Updates: Push or background',
              'Max duration: 8 hours',
            ]}
            colorMode={colorMode}
          />
          
          <SpecCard
            title="Dynamic Island"
            specs={[
              'Minimal: 130×37pt (hardware)',
              'Compact: ~250×37pt',
              'Expanded: 360×84-200pt',
              'Background: Always black',
              'Corners: Follow hardware',
              'iPhone 14 Pro+ only',
            ]}
            colorMode={colorMode}
          />
          
          <SpecCard
            title="Interactions"
            specs={[
              'Tap: Open app to session',
              'Long-press: Expand/collapse',
              'Buttons: Deep link actions',
              'Swipe up: Dismiss (Lock Screen)',
              'Auto-dismiss: On completion',
              'User control: Can remove',
            ]}
            colorMode={colorMode}
          />
        </div>
      </section>

      {/* Implementation Notes */}
      <div
        style={{
          backgroundColor: infoBg,
          borderRadius: '16px',
          padding: '20px',
          border: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '12px' }}>
          Implementation Notes
        </div>
        <div style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px', marginBottom: '12px' }}>
          <strong>ActivityKit Framework:</strong> Use ActivityKit and WidgetKit to create Live Activities. They share similar APIs but Live Activities update dynamically.
        </div>
        <ul style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px', paddingLeft: '20px', margin: 0 }}>
          <li>Define ActivityAttributes with state and content data</li>
          <li>Use ActivityConfiguration to set up appearance</li>
          <li>Update via pushes (APNs) or local updates</li>
          <li>Dynamic Island sizes adapt automatically based on content</li>
          <li>Test using Xcode simulator with Dynamic Island support</li>
          <li>Handle state changes: idle → active → paused → completed</li>
        </ul>
      </div>
    </div>
  );
}

interface SpecCardProps {
  title: string;
  specs: string[];
  colorMode: ColorMode;
}

function SpecCard({ title, specs, colorMode }: SpecCardProps) {
  const isLight = colorMode === 'light';
  const bgColor = isLight ? '#FFFFFF' : '#1C1C1E';
  const borderColor = isLight ? '#E5E5EA' : '#2C2C2E';
  const primaryText = isLight ? '#000000' : '#FFFFFF';
  const secondaryText = isLight ? '#3C3C43' : '#AEAEB2';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '16px',
      }}
    >
      <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '12px' }}>
        {title}
      </div>
      <ul style={{ fontSize: '13px', color: secondaryText, lineHeight: '20px', paddingLeft: '16px', margin: 0 }}>
        {specs.map((spec, idx) => (
          <li key={idx} style={{ marginBottom: '4px' }}>
            {spec}
          </li>
        ))}
      </ul>
    </div>
  );
}
