import { useState } from 'react';
import { SmallWidget } from './components/SmallWidget';
import { MediumWidget } from './components/MediumWidget';
import { LargeWidget } from './components/LargeWidget';
import { SmallWidgetV2 } from './components/SmallWidgetV2';
import { MediumWidgetV2 } from './components/MediumWidgetV2';
import { LargeWidgetV2 } from './components/LargeWidgetV2';
import { DesignCritique } from './components/DesignCritique';
import { Moon, Sun, ChevronDown } from 'lucide-react';

type WidgetState = 'idle' | 'active' | 'paused' | 'completed' | 'automation';
type ColorMode = 'light' | 'dark';
type ViewMode = 'widgets' | 'critique' | 'comparison';

export default function App() {
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [selectedState, setSelectedState] = useState<WidgetState>('active');
  const [viewMode, setViewMode] = useState<ViewMode>('comparison');

  const states: { value: WidgetState; label: string }[] = [
    { value: 'idle', label: 'Idle State' },
    { value: 'active', label: 'Active Timer (50%)' },
    { value: 'paused', label: 'Paused State' },
    { value: 'completed', label: 'Completed State' },
    { value: 'automation', label: 'Automation Active' },
  ];

  const bgColor = colorMode === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const textColor = colorMode === 'light' ? 'text-gray-900' : 'text-white';
  const secondaryTextColor = colorMode === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">MonoFocus iOS Widgets</h1>
              <p className={secondaryTextColor}>
                {viewMode === 'widgets' 
                  ? 'High-fidelity widget designs for all sizes and states'
                  : 'Principal Designer Review & Improvement Roadmap'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className={`flex rounded-lg border ${colorMode === 'light' ? 'border-gray-300 bg-gray-100' : 'border-gray-700 bg-gray-800'}`}>
                <button
                  onClick={() => setViewMode('widgets')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'widgets'
                      ? colorMode === 'light'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'bg-gray-900 text-white shadow-sm'
                      : secondaryTextColor
                  }`}
                >
                  Widgets
                </button>
                <button
                  onClick={() => setViewMode('critique')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'critique'
                      ? colorMode === 'light'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'bg-gray-900 text-white shadow-sm'
                      : secondaryTextColor
                  }`}
                >
                  Design Review
                </button>
                <button
                  onClick={() => setViewMode('comparison')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'comparison'
                      ? colorMode === 'light'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'bg-gray-900 text-white shadow-sm'
                      : secondaryTextColor
                  }`}
                >
                  Comparison
                </button>
              </div>
              
              <button
                onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
                className={`p-3 rounded-full transition-colors ${
                  colorMode === 'light'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900'
                }`}
                aria-label="Toggle color mode"
              >
                {colorMode === 'light' ? <Moon size={24} /> : <Sun size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {viewMode === 'critique' ? (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <DesignCritique colorMode={colorMode} />
        </div>
      ) : viewMode === 'comparison' ? (
        <>
          {/* Controls */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <label className={secondaryTextColor}>Widget State:</label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as WidgetState)}
                  className={`appearance-none px-4 py-2 pr-10 rounded-lg border ${
                    colorMode === 'light'
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-gray-800 border-gray-700 text-white'
                  } cursor-pointer`}
                >
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${secondaryTextColor}`}
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Comparison View */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="space-y-16">
              {/* Small Widget Comparison */}
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl mb-2">Small Widget (158×158pt)</h2>
                  <p className={secondaryTextColor}>
                    Improvements: iOS Dynamic Type, exact dimensions, iOS semantic colors, better state differentiation
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <div className={`text-sm mb-4 ${secondaryTextColor}`}>
                      ❌ Before (Initial Design)
                    </div>
                    <SmallWidget state={selectedState} colorMode={colorMode} />
                  </div>
                  <div>
                    <div className={`text-sm mb-4 ${colorMode === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      ✓ After (Improved Design)
                    </div>
                    <SmallWidgetV2 state={selectedState} colorMode={colorMode} />
                  </div>
                </div>
              </section>

              {/* Medium Widget Comparison */}
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl mb-2">Medium Widget (338×158pt)</h2>
                  <p className={secondaryTextColor}>
                    Improvements: 60/35 space allocation, simplified presets (no fake buttons), better typography hierarchy
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <div className={`text-sm mb-4 ${secondaryTextColor}`}>
                      ❌ Before (Initial Design)
                    </div>
                    <MediumWidget state={selectedState} colorMode={colorMode} />
                  </div>
                  <div>
                    <div className={`text-sm mb-4 ${colorMode === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      ✓ After (Improved Design)
                    </div>
                    <MediumWidgetV2 state={selectedState} colorMode={colorMode} />
                  </div>
                </div>
              </section>

              {/* Large Widget Comparison */}
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl mb-2">Large Widget (338×354pt)</h2>
                  <p className={secondaryTextColor}>
                    Improvements: Removed presets (focus on stats), removed dividers, better spacing groups, simplified information
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <div className={`text-sm mb-4 ${secondaryTextColor}`}>
                      ❌ Before (Initial Design)
                    </div>
                    <LargeWidget state={selectedState} colorMode={colorMode} />
                  </div>
                  <div>
                    <div className={`text-sm mb-4 ${colorMode === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      ✓ After (Improved Design)
                    </div>
                    <LargeWidgetV2 state={selectedState} colorMode={colorMode} />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Key Improvements Summary */}
          <div className={`border-t ${colorMode === 'light' ? 'border-gray-200' : 'border-gray-800'} mt-12`}>
            <div className="max-w-7xl mx-auto px-6 py-12">
              <h2 className="text-2xl mb-6">Key Improvements Applied</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ImprovementCard
                  title="Typography"
                  before={['Custom px sizes', 'Random letter spacing', 'No line heights']}
                  after={['iOS Dynamic Type scale', 'iOS letter spacing', 'Proper line heights']}
                  colorMode={colorMode}
                />
                <ImprovementCard
                  title="Colors"
                  before={['Tailwind grays', 'Pure black dark mode', 'No accent color']}
                  after={['iOS semantic colors', '#1C1C1E elevated surface', 'iOS Blue accent']}
                  colorMode={colorMode}
                />
                <ImprovementCard
                  title="Spacing"
                  before={['Uniform 16pt padding', 'Random gaps', 'Inconsistent sizing']}
                  after={['Size-appropriate padding', '8pt grid system', 'Exact iOS dimensions']}
                  colorMode={colorMode}
                />
                <ImprovementCard
                  title="States"
                  before={['Subtle paused (70% opacity)', 'No celebration', 'Inconsistent automation']}
                  after={['Dashed ring for paused', 'Green success color', 'Consistent AUTO badge']}
                  colorMode={colorMode}
                />
                <ImprovementCard
                  title="Interactions"
                  before={['Fake button affordances', 'Hover states', '4-7 tap zones']}
                  after={['Info cards, not buttons', 'No hover states', '2 tap zones max']}
                  colorMode={colorMode}
                />
                <ImprovementCard
                  title="Information"
                  before={['Large: 7 info units', 'Multiple dividers', 'Competing hierarchy']}
                  after={['Large: 4 info units', 'Spacing, no dividers', 'Clear 3-tier hierarchy']}
                  colorMode={colorMode}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Controls */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <label className={secondaryTextColor}>Widget State:</label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as WidgetState)}
                  className={`appearance-none px-4 py-2 pr-10 rounded-lg border ${
                    colorMode === 'light'
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-gray-800 border-gray-700 text-white'
                  } cursor-pointer`}
                >
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${secondaryTextColor}`}
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Widget Showcase */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="space-y-12">
              {/* Small Widget Section */}
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl mb-2">Small Widget (2×2)</h2>
                  <p className={secondaryTextColor}>
                    Centered time display with circular progress ring. Tap to open app.
                  </p>
                </div>
                <div className="flex gap-8 flex-wrap">
                  <SmallWidget state={selectedState} colorMode={colorMode} />
                </div>
              </section>

              {/* Medium Widget Section */}
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl mb-2">Medium Widget (4×2)</h2>
                  <p className={secondaryTextColor}>
                    Timer status with preset quick start buttons. Different tap areas for different actions.
                  </p>
                </div>
                <div className="flex gap-8 flex-wrap">
                  <MediumWidget state={selectedState} colorMode={colorMode} />
                </div>
              </section>

              {/* Large Widget Section */}
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl mb-2">Large Widget (4×4)</h2>
                  <p className={secondaryTextColor}>
                    Full timer status with today's statistics and preset quick actions.
                  </p>
                </div>
                <div className="flex gap-8 flex-wrap">
                  <LargeWidget state={selectedState} colorMode={colorMode} />
                </div>
              </section>
            </div>
          </div>

          {/* Design Specifications */}
          <div className={`border-t ${colorMode === 'light' ? 'border-gray-200' : 'border-gray-800'} mt-12`}>
            <div className="max-w-7xl mx-auto px-6 py-12">
              <h2 className="text-2xl mb-6">Design Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SpecCard
                  title="Typography"
                  items={[
                    'Font: SF Pro Display/Text',
                    'Dynamic Type support',
                    'High contrast ratios (4.5:1+)',
                    'Clear hierarchy',
                  ]}
                  colorMode={colorMode}
                />
                <SpecCard
                  title="Spacing"
                  items={[
                    'Corner Radius: 20pt',
                    'Content Margins: 16pt',
                    'Base Scale: 4px',
                    'Touch Targets: 44×44pt min',
                  ]}
                  colorMode={colorMode}
                />
                <SpecCard
                  title="Interaction"
                  items={[
                    'Tap regions for deep links',
                    'Timeline updates every minute',
                    'Glanceable information',
                    'iOS native feel',
                  ]}
                  colorMode={colorMode}
                />
                <SpecCard
                  title="Accessibility"
                  items={[
                    'VoiceOver compatible',
                    'Reduced motion support',
                    'Sufficient contrast',
                    'Dynamic Type scaling',
                  ]}
                  colorMode={colorMode}
                />
                <SpecCard
                  title="States"
                  items={[
                    'Idle: No active timer',
                    'Active: Running with progress',
                    'Paused: Visual distinction',
                    'Completed: Timer finished',
                    'Automation: Mode indicator',
                  ]}
                  colorMode={colorMode}
                />
                <SpecCard
                  title="Color Modes"
                  items={[
                    'Light: White background',
                    'Dark: Black background',
                    'Smooth transitions',
                    'Consistent with app',
                  ]}
                  colorMode={colorMode}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface SpecCardProps {
  title: string;
  items: string[];
  colorMode: ColorMode;
}

function SpecCard({ title, items, colorMode }: SpecCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl ${
        colorMode === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
      }`}
    >
      <h3 className="mb-4">{title}</h3>
      <ul className={`space-y-2 ${colorMode === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ImprovementCardProps {
  title: string;
  before: string[];
  after: string[];
  colorMode: ColorMode;
}

function ImprovementCard({ title, before, after, colorMode }: ImprovementCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl ${
        colorMode === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
      }`}
    >
      <h3 className="mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className={`text-sm ${colorMode === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Before</h4>
          <ul className={`space-y-2 ${colorMode === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {before.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className={`text-sm ${colorMode === 'light' ? 'text-green-600' : 'text-green-400'}`}>After</h4>
          <ul className={`space-y-2 ${colorMode === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {after.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}