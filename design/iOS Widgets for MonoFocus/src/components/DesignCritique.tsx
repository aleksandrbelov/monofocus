import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

type ColorMode = 'light' | 'dark';

interface CritiqueProps {
  colorMode: ColorMode;
}

export function DesignCritique({ colorMode }: CritiqueProps) {
  const isLight = colorMode === 'light';
  const bgColor = isLight ? 'bg-white' : 'bg-gray-900';
  const borderColor = isLight ? 'border-gray-200' : 'border-gray-700';
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const secondaryText = isLight ? 'text-gray-600' : 'text-gray-400';
  const criticalBg = isLight ? 'bg-red-50' : 'bg-red-950/30';
  const criticalBorder = isLight ? 'border-red-200' : 'border-red-900';
  const criticalText = isLight ? 'text-red-700' : 'text-red-400';
  const warningBg = isLight ? 'bg-yellow-50' : 'bg-yellow-950/30';
  const warningBorder = isLight ? 'border-yellow-200' : 'border-yellow-900';
  const warningText = isLight ? 'text-yellow-700' : 'text-yellow-400';
  const successBg = isLight ? 'bg-green-50' : 'bg-green-950/30';
  const successBorder = isLight ? 'border-green-200' : 'border-green-900';
  const successText = isLight ? 'text-green-700' : 'text-green-400';

  const critiques = [
    {
      category: 'Typography & Text Hierarchy',
      severity: 'critical',
      issues: [
        {
          problem: 'Font sizes don\'t align with iOS Dynamic Type scale',
          current: 'Custom sizes like 28px, 24px, 40px',
          shouldBe: 'iOS scale: .largeTitle (34pt), .title (28pt), .title2 (22pt), .body (17pt), .callout (16pt), .footnote (13pt), .caption (12pt)',
          impact: 'Breaks accessibility for users with larger text settings',
        },
        {
          problem: 'Letter spacing is inconsistent and not iOS-standard',
          current: 'Random values like -0.5px, -1px, 0.5px',
          shouldBe: 'iOS uses specific tracking: -0.41pt for large titles, -0.08pt for body, etc.',
          impact: 'Doesn\'t feel native, readability issues',
        },
        {
          problem: 'Line heights not specified according to iOS standards',
          current: 'Using lineHeight: "1" everywhere',
          shouldBe: 'iOS Dynamic Type has specific line heights per style (e.g., 41pt for largeTitle, 22pt for body)',
          impact: 'Text may clip or have poor vertical rhythm',
        },
        {
          problem: 'Tabular numbers styling is good but font-weight values are off',
          current: 'font-weight: 600 (semibold)',
          shouldBe: 'iOS uses specific weights: Regular (400), Medium (500), Semibold (600), Bold (700). Time should be Semibold or Bold',
          impact: 'Minor, but affects consistency',
        },
      ],
      fixes: [
        'Map all text to iOS Dynamic Type scale',
        'Create typography tokens matching SF Pro specs exactly',
        'Remove all custom px sizes, use pt units',
        'Implement proper letter-spacing from iOS guidelines',
        'Add line-height for all text elements',
      ],
    },
    {
      category: 'Widget Layout & Spacing',
      severity: 'critical',
      issues: [
        {
          problem: 'Padding is uniform (16pt) but should vary by widget size',
          current: '16pt padding for all widgets',
          shouldBe: 'Small: 16pt, Medium: 16pt horizontal/12pt vertical, Large: 20pt',
          impact: 'Inefficient use of space, especially on large widget',
        },
        {
          problem: 'Progress circles are not properly sized for optical balance',
          current: 'Small: 140px, Medium: 100px, Large: 160px',
          shouldBe: 'Should be calculated based on golden ratio and widget safe area. Small: ~120pt, Medium: ~88pt, Large: ~140pt',
          impact: 'Visual imbalance, elements feel cramped',
        },
        {
          problem: 'Medium widget has poor space distribution (50/50 split)',
          current: 'Timer and presets get equal space',
          shouldBe: 'Timer should get ~60%, presets ~35%, with 5% for divider/spacing',
          impact: 'Timer isn\'t prominent enough as primary content',
        },
        {
          problem: 'Large widget has too many dividers creating visual fragmentation',
          current: '3 sections with 2 full-width dividers',
          shouldBe: 'Use spacing and grouping instead of dividers. Max 1 divider if needed',
          impact: 'Feels cluttered and busy, not glanceable',
        },
      ],
      fixes: [
        'Recalculate padding for each widget size',
        'Use 8pt grid system for all spacing',
        'Adjust progress circle sizing for optical balance',
        'Redesign medium widget with 60/35 split',
        'Remove dividers from large widget, use spacing groups',
        'Ensure 44×44pt minimum tap targets',
      ],
    },
    {
      category: 'Progress Indicator Design',
      severity: 'high',
      issues: [
        {
          problem: 'Stroke width doesn\'t scale proportionally',
          current: 'Small: 8px, Medium: 6px, Large: 10px',
          shouldBe: 'Should maintain ~5-6% ratio of circle diameter. Small: 6pt, Medium: 5pt, Large: 8pt',
          impact: 'Inconsistent visual weight across sizes',
        },
        {
          problem: 'Progress track (background) is too light in dark mode',
          current: '#1f2937 (gray-800)',
          shouldBe: '#111827 (gray-900) or even darker for better contrast',
          impact: 'Insufficient contrast, hard to see remaining portion',
        },
        {
          problem: 'No consideration for reduced motion',
          current: 'transition: stroke-dashoffset 0.3s ease',
          shouldBe: 'Should check prefers-reduced-motion and disable animation',
          impact: 'Accessibility violation for motion-sensitive users',
        },
        {
          problem: 'Linear progress not offered as alternative',
          current: 'Only circular progress',
          shouldBe: 'Consider linear option for paused state or as accessibility alternative',
          impact: 'Less flexibility, harder to read for some users',
        },
      ],
      fixes: [
        'Normalize stroke width ratios across all sizes',
        'Darken progress track in dark mode to #0a0a0a',
        'Add prefers-reduced-motion media query support',
        'Consider adding subtle linear progress indicator',
        'Use strokeLinecap="round" consistently',
      ],
    },
    {
      category: 'State Differentiation',
      severity: 'critical',
      issues: [
        {
          problem: 'Paused state is too subtle - only 70% opacity and gradient',
          current: 'opacity: 0.7 + subtle overlay gradient',
          shouldBe: 'Needs stronger visual: pulsing ring, dashed progress, or pause icon overlay',
          impact: 'Users can\'t quickly distinguish paused from active',
        },
        {
          problem: 'Completed state doesn\'t celebrate success enough',
          current: 'Just a checkmark icon and "00:00"',
          shouldBe: 'Show achievement: "30 min completed" with subtle success color accent',
          impact: 'Missed opportunity for positive reinforcement',
        },
        {
          problem: 'Automation indicator is inconsistent across sizes',
          current: 'Small: top-right corner, Medium: on circle, Large: button-style badge',
          shouldBe: 'Consistent placement and style across all sizes (suggest top-right badge)',
          impact: 'Confusing UX, inconsistent pattern recognition',
        },
        {
          problem: 'Idle state shows icon but no clear call-to-action',
          current: 'Play icon with "No Timer" label',
          shouldBe: '"Tap to start" microcopy or "Start Focus" with arrow',
          impact: 'Not actionable enough',
        },
      ],
      fixes: [
        'Redesign paused state: add dashed/segmented progress ring',
        'Add pause icon badge overlay on circle',
        'Completed state: show session duration + success accent',
        'Standardize automation badge position (top-right, 8pt from edge)',
        'Add clear CTAs to idle state',
        'Consider animation states (subtle pulse for active)',
      ],
    },
    {
      category: 'Color & Contrast',
      severity: 'high',
      issues: [
        {
          problem: 'Gray values are not from iOS semantic color system',
          current: 'Using Tailwind grays (#6b7280, #9ca3af, etc.)',
          shouldBe: 'Use iOS system colors: label, secondaryLabel, tertiaryLabel, systemGray, systemGray2, etc.',
          impact: 'Doesn\'t adapt to iOS color schemes properly',
        },
        {
          problem: 'No accent color for emphasis or branding',
          current: 'Pure black/white only',
          shouldBe: 'MonoFocus should have a subtle accent (e.g., deep blue, purple) for active states and CTAs',
          impact: 'Too monotone, lacks personality and hierarchy',
        },
        {
          problem: 'Contrast ratios not verified for WCAG compliance',
          current: 'Assuming sufficient contrast',
          shouldBe: 'All text needs 4.5:1 minimum (AAA: 7:1). Progress needs 3:1 against background',
          impact: 'Potential accessibility failure',
        },
        {
          problem: 'Dark mode is pure black (#000) which can cause smearing on OLED',
          current: 'bg-black (#000000)',
          shouldBe: '#0a0a0a or #121212 for elevated surfaces, #000 only for base layer',
          impact: 'OLED smearing, hard edges, eye strain',
        },
      ],
      fixes: [
        'Define semantic color tokens: primary, secondary, tertiary text',
        'Add subtle accent color (suggest #4A90E2 or similar)',
        'Audit all contrast ratios with Stark or similar tool',
        'Use elevated backgrounds for dark mode: #0a0a0a for widgets',
        'Add opacity-based elevation system',
      ],
    },
    {
      category: 'Interaction Design & Affordances',
      severity: 'critical',
      issues: [
        {
          problem: 'Preset "buttons" look interactive but entire widget is one tap target',
          current: 'Visual buttons with hover states',
          shouldBe: 'Either remove button styling or make them visually distinct as "information cards"',
          impact: 'Confusing affordances - users will expect buttons to work individually',
        },
        {
          problem: 'No visual indication of tap regions/deep link areas',
          current: 'Annotations below widget',
          shouldBe: 'Subtle visual hints: slight borders, card elevations, or icon badges',
          impact: 'Users don\'t know what\'s tappable',
        },
        {
          problem: 'Medium/Large widgets have too many implied tap zones',
          current: 'Medium: 4 zones (timer + 3 presets), Large: 7 zones (timer + 2 stats + 3 presets)',
          shouldBe: 'iOS recommends 1-2 deep link regions max. Simplify to: whole widget → app, OR timer → app + preset area → preset picker',
          impact: 'Cognitive overload, impossible to communicate',
        },
        {
          problem: 'Hover states shown but iOS widgets don\'t support hover',
          current: 'hover:scale-[1.02] on buttons',
          shouldBe: 'Remove all hover states - they won\'t work on iOS',
          impact: 'False expectations in implementation',
        },
      ],
      fixes: [
        'Remove button styling from presets - make them info cards',
        'Simplify to 1-2 tap regions maximum per widget',
        'Add subtle visual separators between tap zones',
        'Remove all hover states and interactions',
        'Add "Tap to configure presets" hint on preset area',
        'Consider: whole widget tap → app is simplest and most iOS-like',
      ],
    },
    {
      category: 'Information Hierarchy & Glanceability',
      severity: 'high',
      issues: [
        {
          problem: 'Large widget tries to show too much information',
          current: 'Timer + progress + label + 2 stats + 3 presets = 7 information units',
          shouldBe: 'Max 3-4 primary information units. Remove presets or stats.',
          impact: 'Not glanceable - takes >3 seconds to parse',
        },
        {
          problem: 'Secondary text is competing for attention',
          current: 'Multiple labels at similar sizes and weights',
          shouldBe: 'Clear hierarchy: 1 primary (time), 1-2 secondary (label, progress %), rest tertiary',
          impact: 'Eye doesn\'t know where to look first',
        },
        {
          problem: 'Progress percentage shown in large widget but not others',
          current: 'Inconsistent across sizes',
          shouldBe: 'Either show in all or none. Recommend: show in active state only, all sizes',
          impact: 'Inconsistent mental model',
        },
        {
          problem: 'Stats in large widget use icons but meaning isn\'t immediately clear',
          current: 'CheckCircle for sessions, Clock for time',
          shouldBe: 'Icons should be universally understood or have clear labels. "3 sessions" is better than icon + "3"',
          impact: 'Requires cognitive effort to decode',
        },
      ],
      fixes: [
        'Large widget: Choose either stats OR presets, not both',
        'Establish 3-tier hierarchy: primary (34pt), secondary (17pt), tertiary (13pt)',
        'Show progress % consistently in active state',
        'Simplify stat cards: larger numbers, clearer labels',
        'Apply 3-second glanceability test to all designs',
        'Remove redundant information',
      ],
    },
    {
      category: 'iOS Widget Guidelines Compliance',
      severity: 'critical',
      issues: [
        {
          problem: 'Designs assume real-time updates but widgets have limited refresh',
          current: 'Showing exact time remaining',
          shouldBe: 'Should round to nearest minute after first 60s, or show end time instead',
          impact: 'Widget won\'t update every second - will show stale data',
        },
        {
          problem: 'No consideration for widget timeline entries',
          current: 'Single static design',
          shouldBe: 'Should plan for: 1) current state, 2) end-of-timer state, 3) post-completion state',
          impact: 'Implementation won\'t match design expectations',
        },
        {
          problem: 'Widget corner radius may not match iOS system value',
          current: '20px assumed',
          shouldBe: 'Should use system-provided corner radius (varies by device and iOS version)',
          impact: 'May look wrong on actual devices',
        },
        {
          problem: 'No safe area or margin considerations for actual widget sizes',
          current: 'Fixed dimensions in px',
          shouldBe: 'Use actual iOS widget sizes: Small 158×158pt, Medium 338×158pt, Large 338×354pt (varies by device)',
          impact: 'Design won\'t match real widget proportions',
        },
      ],
      fixes: [
        'Show end time ("Ends 3:45 PM") instead of countdown for long timers',
        'Design timeline: active → ending soon (5 min) → completed → idle',
        'Use system corner radius in specs',
        'Redesign with exact iOS widget dimensions',
        'Plan for widget background blur/vibrancy materials',
        'Consider widget family support matrix',
      ],
    },
    {
      category: 'Accessibility & Inclusive Design',
      severity: 'high',
      issues: [
        {
          problem: 'No consideration for VoiceOver labels',
          current: 'Visual design only',
          shouldBe: 'Should specify: "Timer: 15 minutes remaining, 50 percent complete, Focus Time session"',
          impact: 'Blind users can\'t understand widget state',
        },
        {
          problem: 'Color is only differentiator between states in some cases',
          current: 'Active vs paused relies on opacity',
          shouldBe: 'Need shape, pattern, or icon differences too',
          impact: 'Fails for colorblind users',
        },
        {
          problem: 'Small text in large widget stats may be unreadable at distance',
          current: '10px labels',
          shouldBe: 'Minimum 13pt (iOS caption size) for any text',
          impact: 'Can\'t read from normal viewing distance',
        },
        {
          problem: 'No consideration for Extra Large accessibility sizes',
          current: 'Fixed layouts',
          shouldBe: 'Should show how layout adapts for XXL and XXXL text sizes',
          impact: 'Breaks for users with visual impairments',
        },
      ],
      fixes: [
        'Write VoiceOver labels for all widget states',
        'Add non-color differentiators: dashed rings for paused, etc.',
        'Increase all text to minimum 13pt',
        'Design responsive layouts for larger text',
        'Test with Accessibility Inspector',
        'Ensure 3:1 contrast for all UI elements',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className={`${bgColor} border ${borderColor} rounded-2xl p-6`}>
        <h2 className={`text-2xl mb-4 ${textColor}`}>
          Principal Designer Review: MonoFocus Widgets
        </h2>
        <p className={secondaryText}>
          Comprehensive critique with actionable improvements. Issues categorized by severity and impact.
        </p>
      </div>

      {critiques.map((critique, index) => (
        <CritiqueSection key={index} {...critique} colorMode={colorMode} />
      ))}

      <PrioritizedRoadmap colorMode={colorMode} />
    </div>
  );
}

function CritiqueSection({
  category,
  severity,
  issues,
  fixes,
  colorMode,
}: {
  category: string;
  severity: 'critical' | 'high' | 'medium';
  issues: Array<{
    problem: string;
    current: string;
    shouldBe: string;
    impact: string;
  }>;
  fixes: string[];
  colorMode: ColorMode;
}) {
  const isLight = colorMode === 'light';
  const bgColor = isLight ? 'bg-white' : 'bg-gray-900';
  const borderColor = isLight ? 'border-gray-200' : 'border-gray-700';
  const textColor = isLight ? 'text-gray-900' : 'text-white';

  const severityConfig = {
    critical: {
      bg: isLight ? 'bg-red-50' : 'bg-red-950/30',
      border: isLight ? 'border-red-300' : 'border-red-900',
      text: isLight ? 'text-red-700' : 'text-red-400',
      label: 'CRITICAL',
    },
    high: {
      bg: isLight ? 'bg-yellow-50' : 'bg-yellow-950/30',
      border: isLight ? 'border-yellow-300' : 'border-yellow-900',
      text: isLight ? 'text-yellow-700' : 'text-yellow-400',
      label: 'HIGH PRIORITY',
    },
    medium: {
      bg: isLight ? 'bg-blue-50' : 'bg-blue-950/30',
      border: isLight ? 'border-blue-300' : 'border-blue-900',
      text: isLight ? 'text-blue-700' : 'text-blue-400',
      label: 'MEDIUM',
    },
  };

  const config = severityConfig[severity];

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl overflow-hidden`}>
      <div className={`${config.bg} border-b ${config.border} px-6 py-4 flex items-center gap-3`}>
        <AlertCircle className={config.text} size={24} />
        <div>
          <div className={`text-xs ${config.text} mb-1`} style={{ letterSpacing: '0.5px' }}>
            {config.label}
          </div>
          <h3 className={`text-xl ${textColor}`}>{category}</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {issues.map((issue, idx) => (
          <div key={idx} className="space-y-3">
            <div className={`${config.text}`}>
              <strong>Issue #{idx + 1}:</strong> {issue.problem}
            </div>
            <div className="grid md:grid-cols-2 gap-4 pl-4">
              <div>
                <div className={`text-xs ${isLight ? 'text-red-600' : 'text-red-400'} mb-1`}>
                  ❌ Current Implementation
                </div>
                <div
                  className={`${isLight ? 'bg-red-50 border-red-200' : 'bg-red-950/20 border-red-900'} border rounded-lg p-3 text-sm`}
                >
                  {issue.current}
                </div>
              </div>
              <div>
                <div className={`text-xs ${isLight ? 'text-green-600' : 'text-green-400'} mb-1`}>
                  ✓ Should Be
                </div>
                <div
                  className={`${isLight ? 'bg-green-50 border-green-200' : 'bg-green-950/20 border-green-900'} border rounded-lg p-3 text-sm`}
                >
                  {issue.shouldBe}
                </div>
              </div>
            </div>
            <div className={`pl-4 text-sm italic ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              <strong>Impact:</strong> {issue.impact}
            </div>
            {idx < issues.length - 1 && (
              <div className={`border-t ${isLight ? 'border-gray-100' : 'border-gray-800'} my-4`} />
            )}
          </div>
        ))}

        <div className={`border-t ${borderColor} pt-6 mt-6`}>
          <div className={`text-sm mb-3 ${isLight ? 'text-green-700' : 'text-green-400'}`}>
            <strong>Action Items:</strong>
          </div>
          <ul className="space-y-2">
            {fixes.map((fix, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2
                  size={16}
                  className={`${isLight ? 'text-green-600' : 'text-green-400'} mt-0.5 flex-shrink-0`}
                />
                <span className={`text-sm ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>{fix}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PrioritizedRoadmap({ colorMode }: { colorMode: ColorMode }) {
  const isLight = colorMode === 'light';
  const bgColor = isLight ? 'bg-white' : 'bg-gray-900';
  const borderColor = isLight ? 'border-gray-200' : 'border-gray-700';
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const secondaryText = isLight ? 'text-gray-600' : 'text-gray-400';

  const phases = [
    {
      phase: 'Phase 1: Critical Foundation',
      timeline: 'Week 1',
      tasks: [
        'Fix typography - implement iOS Dynamic Type scale',
        'Recalculate all spacing with 8pt grid system',
        'Audit and fix all contrast ratios (WCAG AA minimum)',
        'Remove fake interactive affordances (button styles)',
        'Simplify tap regions to 1-2 zones maximum',
        'Design proper paused state with dashed progress ring',
      ],
    },
    {
      phase: 'Phase 2: iOS Compliance',
      timeline: 'Week 2',
      tasks: [
        'Use exact iOS widget dimensions and safe areas',
        'Implement semantic iOS color system',
        'Design widget timeline states (active → ending → completed → idle)',
        'Add automation badge consistently across all sizes',
        'Plan for widget refresh limitations',
        'Add VoiceOver accessibility labels',
      ],
    },
    {
      phase: 'Phase 3: Information Architecture',
      timeline: 'Week 2-3',
      tasks: [
        'Simplify large widget - remove either stats or presets',
        'Establish clear 3-tier visual hierarchy',
        'Redesign medium widget with 60/35 space allocation',
        'Remove dividers from large widget, use spacing',
        'Add subtle accent color for brand and hierarchy',
        'Test glanceability - 3 second comprehension rule',
      ],
    },
    {
      phase: 'Phase 4: Polish & Accessibility',
      timeline: 'Week 3-4',
      tasks: [
        'Design for XXL/XXXL Dynamic Type sizes',
        'Add prefers-reduced-motion support',
        'Design non-color state differentiators',
        'Improve completed state with celebration/achievement',
        'Add clear CTAs to idle state',
        'Test with Accessibility Inspector and real users',
      ],
    },
    {
      phase: 'Phase 5: Production Specs',
      timeline: 'Week 4',
      tasks: [
        'Create detailed design specs with exact pt values',
        'Document all widget states with VoiceOver labels',
        'Provide color tokens in iOS format',
        'Create developer handoff with WidgetKit timeline',
        'Design all state combinations (5 states × 3 sizes × 2 modes = 30 screens)',
        'QA designs on actual device sizes',
      ],
    },
  ];

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl p-6`}>
      <h2 className={`text-2xl mb-6 ${textColor}`}>Prioritized Improvement Roadmap</h2>
      <div className="space-y-6">
        {phases.map((phase, idx) => (
          <div key={idx} className={`border ${borderColor} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={textColor}>{phase.phase}</h3>
              <span
                className={`${isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-950 text-blue-400'} px-3 py-1 rounded-full text-sm`}
              >
                {phase.timeline}
              </span>
            </div>
            <ul className="space-y-2">
              {phase.tasks.map((task, taskIdx) => (
                <li key={taskIdx} className="flex items-start gap-2">
                  <ArrowRight size={16} className={`${secondaryText} mt-0.5 flex-shrink-0`} />
                  <span className={secondaryText}>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={`mt-8 p-4 ${isLight ? 'bg-blue-50' : 'bg-blue-950/30'} rounded-xl`}>
        <p className={`${isLight ? 'text-blue-900' : 'text-blue-200'}`}>
          <strong>Bottom Line:</strong> The current designs show good foundational thinking but need significant
          refinement to meet iOS standards. The main issues are: (1) non-standard typography and spacing, (2) confusing
          interaction affordances, (3) information overload, and (4) insufficient accessibility. Following this roadmap
          will result in production-ready, iOS-native widget designs that users will love.
        </p>
      </div>
    </div>
  );
}
