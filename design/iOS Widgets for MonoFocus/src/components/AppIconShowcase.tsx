import { AppIcon } from './AppIcon';
import { Info, Download, Palette, CheckCircle2 } from 'lucide-react';

type ColorMode = 'light' | 'dark';

interface AppIconShowcaseProps {
  colorMode: ColorMode;
}

export function AppIconShowcase({ colorMode }: AppIconShowcaseProps) {
  const isLight = colorMode === 'light';
  const bgColor = isLight ? '#FFFFFF' : '#1C1C1E';
  const borderColor = isLight ? '#E5E5EA' : '#2C2C2E';
  const primaryText = isLight ? '#000000' : '#FFFFFF';
  const secondaryText = isLight ? '#3C3C43' : '#AEAEB2';
  const tertiaryText = isLight ? '#3C3C4399' : '#AEAEB266';
  const accentColor = isLight ? '#007AFF' : '#0A84FF';
  const infoBg = isLight ? '#F2F2F7' : '#2C2C2E';

  return (
    <div className="space-y-16">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: primaryText, marginBottom: '8px' }}>
          MonoFocus App Icons
        </h2>
        <p style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px' }}>
          A complete set of app icons following iOS design guidelines. The primary icon uses iOS Blue, while alternative icons provide personalization options for users.
        </p>
      </div>

      {/* iOS Guidelines */}
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
            iOS App Icon Requirements
          </div>
          <ul style={{ fontSize: '13px', color: secondaryText, lineHeight: '20px', paddingLeft: '16px', margin: 0 }}>
            <li>Master size: 1024×1024px (required for App Store)</li>
            <li>No transparency - must have opaque background</li>
            <li>iOS automatically applies rounded corner mask (22.5% radius)</li>
            <li>Should be recognizable at small sizes (40×40pt on device)</li>
            <li>Alternative icons available via Settings in iOS 10.3+</li>
            <li>Use consistent visual language with app design</li>
          </ul>
        </div>
      </div>

      {/* Primary Icon Section */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '8px' }}>
            Primary App Icon
          </h3>
          <p style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px' }}>
            The default icon that appears on users&apos; home screens. Features iOS Blue gradient with a progress ring showing 75% completion, representing focus and progress.
          </p>
        </div>

        <div
          style={{
            backgroundColor: isLight ? '#F5F5F7' : '#000000',
            borderRadius: '20px',
            padding: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AppIcon variant="primary" size={240} showLabel={false} />
        </div>

        {/* Size Variants */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '16px' }}>
            Size Variations
          </div>
          <div
            style={{
              backgroundColor: isLight ? '#F5F5F7' : '#000000',
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              gap: '32px',
              alignItems: 'end',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <AppIcon variant="primary" size={120} />
              <div style={{ marginTop: '12px', fontSize: '13px', color: secondaryText }}>120×120</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AppIcon variant="primary" size={90} />
              <div style={{ marginTop: '12px', fontSize: '13px', color: secondaryText }}>90×90</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AppIcon variant="primary" size={60} />
              <div style={{ marginTop: '12px', fontSize: '13px', color: secondaryText }}>60×60</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AppIcon variant="primary" size={40} />
              <div style={{ marginTop: '12px', fontSize: '13px', color: secondaryText }}>40×40</div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Icons - Monochrome Set */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '8px' }}>
            Alternative Icons - Monochrome
          </h3>
          <p style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px' }}>
            Elegant black and white variations for users who prefer a minimal aesthetic.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px',
          }}
        >
          <IconCard variant="minimal" label="Minimal" description="Pure black with clean ring" colorMode={colorMode} />
          <IconCard variant="ring" label="Ring" description="Bold circular design" colorMode={colorMode} />
          <IconCard variant="mono" label="Mono" description="Sophisticated gradient" colorMode={colorMode} />
          <IconCard variant="dark" label="Dark" description="Subtle blue accent" colorMode={colorMode} />
        </div>
      </section>

      {/* Alternative Icons - Color Set */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '8px' }}>
            Alternative Icons - Color Themes
          </h3>
          <p style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px' }}>
            Vibrant gradient options to match different moods and personal preferences.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px',
          }}
        >
          <IconCard variant="gradient" label="Purple Gradient" description="Colorful and vibrant" colorMode={colorMode} />
          <IconCard variant="sunset" label="Sunset" description="Warm orange tones" colorMode={colorMode} />
          <IconCard variant="forest" label="Forest" description="Fresh green energy" colorMode={colorMode} />
          <IconCard variant="ocean" label="Ocean" description="Cool blue waves" colorMode={colorMode} />
          <IconCard variant="midnight" label="Midnight" description="Deep night sky" colorMode={colorMode} />
          <IconCard variant="light" label="Light" description="Soft and minimal" colorMode={colorMode} />
        </div>
      </section>

      {/* Special Variations */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '8px' }}>
            Special Variations
          </h3>
          <p style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px' }}>
            Unique designs showcasing different progress states and visual concepts.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px',
          }}
        >
          <IconCard variant="progress" label="Progress Rings" description="Multiple activity rings" colorMode={colorMode} />
        </div>
      </section>

      {/* Design Specifications */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '8px' }}>
            Design Specifications
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <SpecCard
            icon={<Palette size={20} color={accentColor} strokeWidth={2} />}
            title="Visual Design"
            specs={[
              'Progress ring metaphor',
              'Consistent 75% completion',
              'Round stroke caps',
              'Subtle lighting effects',
              'No drop shadows',
            ]}
            colorMode={colorMode}
          />

          <SpecCard
            icon={<CheckCircle2 size={20} color={accentColor} strokeWidth={2} />}
            title="iOS Compliance"
            specs={[
              '1024×1024px master',
              'Opaque backgrounds only',
              '22.5% corner radius (auto)',
              'Safe area: 88% of canvas',
              'Works at 40×40pt minimum',
            ]}
            colorMode={colorMode}
          />

          <SpecCard
            icon={<Download size={20} color={accentColor} strokeWidth={2} />}
            title="Required Sizes"
            specs={[
              'App Store: 1024×1024',
              'iPhone: 180×180 (@3x)',
              'Settings: 87×87 (@3x)',
              'Spotlight: 120×120 (@3x)',
              'Notification: 60×60 (@3x)',
            ]}
            colorMode={colorMode}
          />
        </div>
      </section>

      {/* Implementation Guide */}
      <div
        style={{
          backgroundColor: infoBg,
          borderRadius: '16px',
          padding: '20px',
          border: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '12px' }}>
          Implementation Guide
        </div>
        <div style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px', marginBottom: '16px' }}>
          <strong>Adding Alternative Icons:</strong>
        </div>
        <ol style={{ fontSize: '15px', color: secondaryText, lineHeight: '24px', paddingLeft: '20px', margin: 0 }}>
          <li>Include all icon variants in Xcode project (Assets.xcassets)</li>
          <li>Declare alternative icons in Info.plist under CFBundleIcons key</li>
          <li>Use UIApplication.setAlternateIconName() to switch icons</li>
          <li>Provide in-app UI for users to select their preferred icon</li>
          <li>Test all sizes on different devices (iPhone, iPad)</li>
          <li>Ensure icons follow App Store Review Guidelines</li>
        </ol>
      </div>

      {/* Design Principles */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: primaryText, marginBottom: '8px' }}>
            Design Principles
          </h3>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <PrincipleCard
            number="1"
            title="Simplicity"
            description="Each icon uses a single, clear metaphor: the progress ring. No complex illustrations or multiple elements competing for attention."
            colorMode={colorMode}
          />
          <PrincipleCard
            number="2"
            title="Recognition"
            description="The circular progress ring is instantly recognizable at all sizes, from 40×40pt notification icons to the full 1024×1024 App Store display."
            colorMode={colorMode}
          />
          <PrincipleCard
            number="3"
            title="Consistency"
            description="All variations maintain the same core structure and proportions, only varying in color and style. This creates a cohesive icon family."
            colorMode={colorMode}
          />
          <PrincipleCard
            number="4"
            title="Personalization"
            description="Alternative icons let users express their personality while maintaining the app&apos;s identity. From minimal black to vibrant gradients."
            colorMode={colorMode}
          />
        </div>
      </section>
    </div>
  );
}

interface IconCardProps {
  variant: 'primary' | 'minimal' | 'gradient' | 'dark' | 'light' | 'progress' | 'ring' | 'mono' | 'sunset' | 'forest' | 'ocean' | 'midnight';
  label: string;
  description: string;
  colorMode: ColorMode;
}

function IconCard({ variant, label, description, colorMode }: IconCardProps) {
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
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <AppIcon variant={variant} size={120} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: primaryText, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '13px', color: secondaryText, lineHeight: '18px' }}>
          {description}
        </div>
      </div>
    </div>
  );
}

interface SpecCardProps {
  icon: React.ReactNode;
  title: string;
  specs: string[];
  colorMode: ColorMode;
}

function SpecCard({ icon, title, specs, colorMode }: SpecCardProps) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        {icon}
        <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText }}>
          {title}
        </div>
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

interface PrincipleCardProps {
  number: string;
  title: string;
  description: string;
  colorMode: ColorMode;
}

function PrincipleCard({ number, title, description, colorMode }: PrincipleCardProps) {
  const isLight = colorMode === 'light';
  const bgColor = isLight ? '#FFFFFF' : '#1C1C1E';
  const borderColor = isLight ? '#E5E5EA' : '#2C2C2E';
  const primaryText = isLight ? '#000000' : '#FFFFFF';
  const secondaryText = isLight ? '#3C3C43' : '#AEAEB2';
  const accentColor = isLight ? '#007AFF' : '#0A84FF';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: isLight ? 'rgba(0, 122, 255, 0.1)' : 'rgba(10, 132, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '17px', fontWeight: '700', color: accentColor }}>
          {number}
        </span>
      </div>
      <div>
        <div style={{ fontSize: '17px', fontWeight: '600', color: primaryText, marginBottom: '4px' }}>
          {title}
        </div>
        <div style={{ fontSize: '15px', color: secondaryText, lineHeight: '22px' }}>
          {description}
        </div>
      </div>
    </div>
  );
}
