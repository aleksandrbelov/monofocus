# MonoFocus Design Implementation Prompt

## 🎯 Objective

Implement the complete MonoFocus design system transformation for the iOS SwiftUI application, converting the current basic timer interface into a sophisticated, iOS-native experience with circular progress visualization, card-based timer display, and premium micro-interactions.

---

## 📋 Complete Implementation Prompt

```
You are an expert iOS SwiftUI developer tasked with implementing a comprehensive design 
system transformation for the MonoFocus timer application.

CONTEXT:
- Current app: Basic timer with simple text display and minimal styling
- Target design: Sophisticated circular timer with digit cards, full iOS chrome simulation
- Design reference: /design/MonoFocus iOS App Design/ (React implementation)
- Documentation: DESIGN_IMPLEMENTATION_PLAN.md, DESIGN_QUICK_START.md, DESIGN_COMPARISON.md

IMPLEMENTATION REQUIREMENTS:

Phase 1: Design System Foundation (Week 1-2)
==========================================

Create a complete design token system in MonoFocus/DesignSystem/Tokens/:

1. Typography.swift
   - Implement 11 iOS font sizes (11pt → 48pt)
   - 5 font weight levels (Regular → Heavy)
   - System font with proper scaling
   - Dynamic Type support

2. Spacing.swift
   - 9-level spacing scale (4pt → 48pt) following 8pt grid
   - Safe area constants (status bar 44pt, home indicator 34pt)
   - Touch target minimums (44pt)

3. Colors.swift
   - Semantic color system (monoForeground, monoBackground)
   - 9 opacity levels (5% → 100%)
   - Surface and label opacity helpers
   - Dark/light mode support

4. Radius.swift
   - 7 border radius levels (8pt → full)
   - iOS-standard corner styles

5. Shadows.swift
   - 4 elevation levels (sm → xl)
   - Reusable shadow struct with apply method

6. Animations.swift
   - 5 duration presets (instant → slower)
   - Standard animation curves (spring, easeOut, easeInOut)
   - Reduced motion support

7. ButtonStyles.swift (in DesignSystem/Modifiers/)
   - PrimaryButtonStyle (inverted, 44pt height, spring animation)
   - SecondaryButtonStyle (bordered, translucent)
   - PresetButtonStyle (with selection state)

REQUIREMENTS:
- All tokens must match design-tokens.css specifications exactly
- Use Swift enums with static properties for type safety
- Include comprehensive preview providers
- Support Dark Mode throughout
- Follow iOS accessibility guidelines


Phase 2: Core Timer Components (Week 3-4)
========================================

Implement the distinctive circular timer interface:

1. CircularProgressView.swift
   - 280pt diameter circle
   - 6pt stroke width
   - AngularGradient (white 100% → 60%)
   - Animated trim(from:to:) for countdown
   - Dashed background when empty [8, 8]
   - Pulsing animation when paused (1.5s cycle, opacity 0.5 ↔ 1.0)
   - Smooth easeOut animation (500ms)

2. DigitCardView.swift
   - 64×80pt card dimensions
   - Inverted background (white on dark, black on light)
   - 48pt bold display font
   - 24pt corner radius (continuous)
   - Shadow: radius 12, y: 4, opacity 0.15

3. TimerDigitsView.swift
   - HStack of 4 DigitCards + colon separator
   - MM:SS format with proper padding
   - 12pt spacing between cards
   - Accessibility label for full time

4. CircularTimerView.swift (Complete Assembly)
   - ZStack: CircularProgressView + TimerDigitsView
   - "PAUSED" indicator (conditional, animated)
   - Time remaining text below (15pt medium, 60% opacity)
   - Format: "X minutes Y seconds left" / "Set your focus time"
   - Spring animations for state transitions

5. EmptyStateView.swift
   - Timer SF Symbol in 48pt circular background
   - Floating animation (y: 0 → -8 → 0, rotate: 0 → 5° → -5° → 0)
   - 3s loop, easeInOut
   - "Start your focus journey" (body semibold)
   - "Try 30 min to stay focused" (subheadline, 50% opacity)
   - Conditional visibility (time == 0 && !isRunning)

REQUIREMENTS:
- Progress must count down (full → empty)
- All measurements exact to design specs
- Smooth 60fps animations
- Proper accessibility labels
- Preview providers for all states


Phase 3: Enhanced Controls (Week 5)
==================================

Upgrade interaction components:

1. PresetButtonGroup.swift
   - 15m, 30m, 60m presets + custom clock icon
   - PresetButtonStyle with selection state
   - Translucent background (10% opacity)
   - Selected: inverted (100% foreground)
   - 44pt minimum height
   - 12pt spacing between buttons
   - Haptic feedback on tap

2. ControlButtonGroup.swift
   - State-aware button rendering:
     * Not running: [▶ Start]
     * Running: [⏸ Pause] [⏹ Stop]
     * Paused: [▶ Resume] [⏹ Stop]
   - SF Symbols: play.fill, pause.fill, stop.fill
   - PrimaryButtonStyle for main action
   - SecondaryButtonStyle for stop
   - Scale + fade transitions
   - Haptic feedback per action type

3. ThemeToggle.swift (New)
   - 44×44pt circular button
   - SF Symbols: sun.max (light), moon.fill (dark)
   - 90° rotation animation (200ms easeInOut)
   - Fade transition between icons
   - 10% opacity background, 20% on hover
   - @AppStorage("isDarkMode") persistence
   - Top-right header position

4. Enhance Haptics in TimerViewModel
   - Add: selection(), toggleOn(), toggleOff()
   - Use appropriate UIImpactFeedbackGenerator styles
   - Map to all interaction points

REQUIREMENTS:
- All touch targets ≥44×44pt
- Smooth state transitions
- Proper icon sizing and alignment
- Haptic feedback on every interaction


Phase 4: Layout & UI Chrome (Week 6)
===================================

Implement iOS-native layout elements:

1. StatusBarView.swift
   - 44pt height + safe area inset
   - Real-time clock (TimelineView, updates every second)
   - Format: "9:41" or "9:41 AM" (system preference)
   - Battery icon SVG (27×13pt)
   - 15pt semibold typography
   - 24pt horizontal margins

2. HomeIndicatorView.swift
   - 134pt × 5pt rounded capsule
   - 36% foreground opacity
   - Centered horizontally
   - 8pt from bottom + safe area inset
   - Use safeAreaInset(edge: .bottom)

3. HeaderView.swift
   - "MonoFocus" title (34pt bold, Large Title)
   - ThemeToggle in top-right
   - Horizontal stack with spacer
   - 24pt horizontal margins

4. CustomModal.swift (Base Component)
   - Centered overlay (not bottom sheet)
   - ZStack with backdrop + content
   - Backdrop: 50% black + .ultraThinMaterial blur
   - Content: 320pt width, auto height
   - 24pt corner radius
   - XL shadow (radius 48, y: 24, opacity 0.3)
   - Scale animation: 0.8 → 1.0 (spring)
   - Opacity animation: 0 → 1
   - Tap backdrop to dismiss
   - Focus trap for accessibility

5. CompletionModal.swift
   - Use CustomModal base
   - CheckCircle2 icon (40pt) in 80pt circular bg
   - "Well Done!" title (28pt bold)
   - "You've completed your focus session" (17pt, 60% opacity)
   - "Continue" button (PrimaryButtonStyle)
   - Auto-focus on button

6. TimePickerModal.swift
   - Use CustomModal base
   - Native iOS Picker for minutes
   - Range: 1-120 minutes
   - "Set Time" title
   - Confirm/Cancel buttons

7. ResumeSessionDialog.swift
   - Use CustomModal base
   - Display time remaining
   - "Resume" / "Discard" buttons
   - Triggered on app launch if session exists

REQUIREMENTS:
- Proper safe area handling
- Blur effects perform well
- Modal focus trapping works
- Animations feel native
- All text scales with Dynamic Type


Phase 5: Automation Redesign (Week 6-7)
======================================

Transform automation UI:

1. AutomationCard.swift
   - 16pt corner radius
   - 5% background opacity
   - HStack layout: [Icon] [Text Column] [Toggle]
   - Icon: 32pt square container, 10% background, 20pt SF Symbol
   - Text: Title (17pt semibold) + Description (13pt, 50% opacity)
   - Native iOS Toggle switch
   - 44pt minimum height
   - 16pt padding

2. AutomationSection.swift
   - "Automation" header (22pt bold)
   - AutomationCard for DND with bell.slash icon
   - Info text below (13pt, 40% opacity)
   - Remove text field inputs
   - Toggle triggers ShortcutService actions

REQUIREMENTS:
- Native iOS toggle styling
- Hover states (iPad support)
- Proper spacing and alignment
- Clear visual hierarchy


Phase 6: Animation System (Week 7)
=================================

Implement comprehensive animation system:

1. All Button Interactions
   - Scale to 0.95 on press
   - Spring animation (response: 0.3, damping: 0.7)
   - 150ms duration

2. Progress Ring
   - Smooth trim animation (500ms easeOut)
   - When paused: Pulsing opacity (1.5s, repeat forever)

3. Modal Presentations
   - Scale: 0.8 → 1.0
   - Opacity: 0 → 1
   - Spring (response: 0.4, damping: 0.8)
   - Backdrop fade (250ms)

4. Theme Toggle
   - Icon rotation: ±90°
   - Cross-fade between icons
   - 200ms easeInOut

5. Empty State
   - Floating: y offset 0 → -8 → 0 (3s, repeat)
   - Rotation: 0° → 5° → -5° → 0° (3s, repeat)
   - easeInOut timing

6. State Transitions
   - Paused indicator: Scale + opacity
   - Button group: Fade + scale
   - Timer text: Opacity fade

7. Reduced Motion Support
   - Detect UIAccessibility.isReduceMotionEnabled
   - Disable decorative animations
   - Keep functional animations instant
   - Use Animations.withReducedMotion() helper

REQUIREMENTS:
- All animations run at 60fps
- No dropped frames during transitions
- Profile with Instruments
- Reduced motion fully supported


Phase 7: Accessibility & Polish (Week 8)
=======================================

Complete accessibility implementation:

1. VoiceOver Support
   - All interactive elements labeled
   - Timer announces updates (debounced)
   - State changes communicated
   - Modal focus trapping
   - Semantic heading hierarchy (title, automation header)
   - Decorative elements hidden (home indicator)

2. Dynamic Type
   - All text uses Typography tokens
   - Layout adapts to larger sizes
   - Test at AX1 through AX5
   - Minimum 44pt touch targets maintained

3. Keyboard Navigation (iPad)
   - Tab order logical
   - Focus indicators visible
   - All controls accessible
   - Shortcuts documented

4. Color Contrast
   - Test with Accessibility Inspector
   - Verify WCAG AA compliance
   - Check light and dark modes
   - Support increased contrast setting

5. Testing Checklist
   - iPhone SE, 14 Pro, 14 Pro Max
   - iPad Pro (keyboard navigation)
   - All timer states
   - Background/foreground transitions
   - Session restoration
   - Dark mode switching
   - Reduced motion
   - VoiceOver navigation
   - Dynamic Type scaling

REQUIREMENTS:
- 100% VoiceOver navigable
- WCAG AA compliant
- All accessibility features tested
- No usability regressions


Integration & Final Assembly
===========================

Update main views to use new components:

1. ContentView.swift
   - Add @AppStorage("isDarkMode") for theme
   - Wrap in ZStack with proper layering:
     * StatusBarView (top)
     * ScrollView (content)
     * HomeIndicatorView (bottom overlay)
     * Modal overlays (conditional)
   - Apply proper safe area insets
   - Theme environment propagation

2. Replace TimerView.swift content
   - Use CircularTimerView
   - Use EmptyStateView (conditional)
   - Use PresetButtonGroup
   - Use ControlButtonGroup
   - Use AutomationSection
   - Remove old preset/button implementations

3. Update Theme.swift → DesignSystem
   - Migrate existing values to new token system
   - Update all references throughout codebase
   - Remove old Theme struct

4. Performance Optimization
   - Profile with Instruments
   - Optimize heavy views
   - Lazy load where appropriate
   - Monitor memory usage
   - Test battery impact

REQUIREMENTS:
- All existing functionality preserved
- No data migration needed
- Session persistence works
- Shortcuts integration unchanged
- Live Activities unchanged
- Widgets unchanged


CODE QUALITY STANDARDS:
======================
- Follow Swift API Design Guidelines
- Maximum file size: 300 lines (split if larger)
- Maximum function complexity: 10
- Document complex logic
- Use meaningful variable names
- Prefer composition over inheritance
- Extract reusable components
- Use @ViewBuilder for flexibility
- Minimize @State variables
- Leverage environment values
- No force unwraps (use guard/if let)
- Proper error handling

SwiftUI Best Practices:
- Prefer declarative over imperative
- Use .animation() modifier correctly
- Profile animation performance
- Avoid nested geometries
- Cache expensive computations
- Use PreferenceKey for child-to-parent communication
- Proper list performance (identifiable, lazy)


TESTING REQUIREMENTS:
====================
For each component:
- Create SwiftUI preview provider
- Test light and dark modes
- Test different device sizes
- Verify accessibility labels
- Check touch target sizes
- Profile animation performance
- Test reduced motion
- Verify Dynamic Type support


DELIVERABLES:
============
- Complete DesignSystem module with all tokens
- All Phase 2-7 components implemented
- Updated main views using new components
- No regressions in existing functionality
- 60fps animation performance
- 100% VoiceOver accessibility
- Comprehensive preview providers
- Performance profiling results
- Testing completion checklist


SUCCESS CRITERIA:
================
- Visual: 95%+ match to Figma design
- Spacing: All measurements within ±2pt tolerance
- Performance: 60fps sustained, <500ms launch, <50MB memory
- Accessibility: 100% VoiceOver, WCAG AA, Dynamic Type supported
- UX: <10s to first timer, <50ms interaction latency


CRITICAL NOTES:
==============
- NO breaking changes to data models
- NO migration of user data required
- Preserve all existing timer logic
- Maintain session persistence format
- Keep Shortcuts integration unchanged
- Live Activities interface unchanged
- Widget functionality unchanged

Use DESIGN_IMPLEMENTATION_PLAN.md as the authoritative technical reference.
Use DESIGN_QUICK_START.md for step-by-step code examples.
Use DESIGN_COMPARISON.md for visual specifications.
Use DESIGN_ARCHITECTURE.md for component relationships.

Begin with Phase 1 (Design Tokens) and proceed sequentially through Phase 7.
Create comprehensive preview providers for each component.
Test continuously throughout implementation.
Profile performance early and often.

Let's build a beautiful, accessible, performant iOS timer app.
```

---

## 🎯 Prompt Variations by Phase

### For AI Assistants (e.g., GitHub Copilot, Cursor)

#### Phase 1 Prompt:
```
Create a complete design token system for MonoFocus iOS app in SwiftUI.

Requirements:
- Create folder: MonoFocus/DesignSystem/Tokens/
- Implement Typography.swift with 11 iOS font sizes (caption2 11pt → display 48pt)
- Implement Spacing.swift with 9-level scale (4pt → 48pt, 8pt grid)
- Implement Colors.swift with semantic colors and 9 opacity levels
- Implement Radius.swift with 7 border radius values (8pt → full)
- Implement Shadows.swift with 4 elevation levels and Shadow struct
- Implement Animations.swift with duration presets and reduced motion support

Reference: /design/MonoFocus iOS App Design/src/styles/design-tokens.css

All tokens must use Swift enums with static properties.
Include comprehensive preview providers showing all values.
Support Dark Mode throughout.
Follow iOS accessibility guidelines.

Start with Typography.swift.
```

#### Phase 2 Prompt:
```
Implement the circular timer interface for MonoFocus.

Create these components in MonoFocus/Views/Timer/:

1. CircularProgressView.swift
   - 280pt diameter, 6pt stroke
   - AngularGradient (white 100% → 60%)
   - Animated trim for countdown
   - Dashed when empty, pulsing when paused

2. DigitCardView.swift
   - 64×80pt card with inverted background
   - 48pt bold display font
   - 24pt corner radius, shadow effect

3. TimerDigitsView.swift
   - 4 DigitCards in HStack (MM:SS format)

4. CircularTimerView.swift
   - Complete assembly with progress ring
   - Conditional paused indicator
   - Time remaining text

5. EmptyStateView.swift
   - Animated timer icon
   - Encouraging copy

Use design tokens from Phase 1.
Reference: DESIGN_QUICK_START.md Steps 3.1-5.1
Include preview providers for all states.
```

#### Phase 3 Prompt:
```
Enhance control buttons and interactions for MonoFocus.

Create in MonoFocus/Views/Controls/:

1. PresetButtonGroup.swift
   - 15m, 30m, 60m + custom buttons
   - Selection state with inverted style
   - Haptic feedback

2. ControlButtonGroup.swift
   - State-aware: Start/Pause/Resume + Stop
   - SF Symbol icons
   - Animated transitions

3. ThemeToggle.swift
   - Sun/moon icons with rotation
   - Persistent @AppStorage

Use PrimaryButtonStyle and SecondaryButtonStyle from Phase 1.
Add haptic feedback methods to TimerViewModel.
Reference: DESIGN_QUICK_START.md Steps 6.1-7.1
```

#### Phase 4 Prompt:
```
Implement iOS chrome and modal system for MonoFocus.

Create in MonoFocus/Views/Layout/:

1. StatusBarView.swift - Real-time clock + battery
2. HomeIndicatorView.swift - iOS bottom bar
3. HeaderView.swift - Title + theme toggle

Create in MonoFocus/Views/Modals/:

4. CustomModal.swift - Base modal component
5. CompletionModal.swift - Success celebration
6. TimePickerModal.swift - Custom time input
7. ResumeSessionDialog.swift - Session recovery

All modals: centered overlay, backdrop blur, scale animation.
Reference: DESIGN_IMPLEMENTATION_PLAN.md Phase 4
```

---

## 💬 Conversational Prompts (for Chat Interfaces)

### Start Conversation:
```
I need to implement a sophisticated design system for my MonoFocus iOS timer app. 
I have complete design documentation in these files:
- DESIGN_IMPLEMENTATION_PLAN.md (main technical spec)
- DESIGN_QUICK_START.md (step-by-step guide)
- DESIGN_COMPARISON.md (visual reference)
- DESIGN_ARCHITECTURE.md (component diagrams)

The design features a circular timer with individual digit cards, complete iOS chrome 
simulation, and premium animations. It's an 8-week, 7-phase implementation.

Let's start with Phase 1: Creating the design token system. Can you help me create 
Typography.swift following the iOS font scale specified in DESIGN_QUICK_START.md 
Step 1.1?
```

### Continue with Each Phase:
```
Phase 1 is complete! Now let's move to Phase 2: Core Timer Components. 

I need to implement the circular timer interface with these components:
1. CircularProgressView (280pt diameter progress ring)
2. DigitCardView (individual digit cards 64×80pt)
3. TimerDigitsView (4 cards in MM:SS format)
4. CircularTimerView (complete assembly)

Let's start with CircularProgressView. Can you implement it according to the 
specifications in DESIGN_QUICK_START.md Step 3.1?
```

---

## 🔄 Iterative Refinement Prompt

```
Review the CircularProgressView implementation against these requirements:

Design Specs:
- Diameter: 280pt
- Stroke width: 6pt
- Gradient: AngularGradient from white 100% to 60% opacity
- Background: 10% opacity, dashed [8, 8] when progress is 0
- Animation: easeOut, 500ms duration
- Paused state: Pulsing opacity 0.5 ↔ 1.0, 1.5s cycle

Current issues to fix:
1. Gradient direction should start from top (rotationEffect -90°)
2. Progress should countdown (empty as time runs out)
3. Pulsing animation only when isPaused is true
4. Background dash pattern only when progress is 0

Update the implementation to match specifications exactly.
```

---

## 🧪 Testing Prompt

```
Create comprehensive SwiftUI preview providers for the CircularTimerView showing:

1. Empty state (time = 0, not running)
2. Time set but not running (time = 1500, not running)
3. Timer running (time = 900, running, progress = 40%)
4. Timer paused (time = 600, paused, progress = 60%)
5. Almost complete (time = 10, running, progress = 99%)

Test in both light and dark modes.
Verify:
- Progress ring animates smoothly
- Digit cards display correctly
- Paused indicator appears/disappears
- Time remaining text updates
- All animations run at 60fps

Include accessibility labels for VoiceOver testing.
```

---

## 📊 Quality Check Prompt

```
Review the completed Phase 2 implementation against quality standards:

Code Quality:
- [ ] All files <300 lines
- [ ] Functions have max complexity of 10
- [ ] No force unwraps
- [ ] Meaningful variable names
- [ ] Complex logic documented

Design Fidelity:
- [ ] All measurements match specs (±2pt tolerance)
- [ ] Typography uses correct font sizes/weights
- [ ] Spacing follows 8pt grid
- [ ] Colors use design token system
- [ ] Animations feel natural

Performance:
- [ ] Runs at 60fps
- [ ] No dropped frames
- [ ] Memory usage reasonable
- [ ] Profile with Instruments

Accessibility:
- [ ] VoiceOver labels present
- [ ] Touch targets ≥44pt
- [ ] Dynamic Type supported
- [ ] Reduced motion respected

Generate a report of any issues found and suggest fixes.
```

---

## 🎓 Learning Prompt (for Understanding)

```
Explain the design decisions behind the MonoFocus timer interface:

1. Why use individual digit cards instead of a single text display?
2. Why is the progress ring circular and counting down (full → empty)?
3. Why use a monochrome color scheme with only opacity variations?
4. Why implement custom centered modals instead of bottom sheets?
5. Why is the animation system based on spring physics?

Reference the design rationale in DESIGN_IMPLEMENTATION_PLAN.md Section 5.

Help me understand the UX thinking so I can maintain consistency throughout.
```

---

## 🚀 Quick Start Single Prompt (Complete Phase 1)

```
Implement the complete design token system for MonoFocus iOS app.

Create these files in MonoFocus/DesignSystem/Tokens/:

1. Typography.swift - iOS font scale (11 sizes) + weights (5 levels)
2. Spacing.swift - 9-level scale (4pt-48pt), 8pt grid, safe areas
3. Colors.swift - Semantic colors + 9 opacity levels
4. Radius.swift - 7 border radius values (8pt-full)
5. Shadows.swift - 4 elevation levels with Shadow struct
6. Animations.swift - Duration presets + easing curves + reduced motion

Create MonoFocus/DesignSystem/Modifiers/ButtonStyles.swift:
- PrimaryButtonStyle (inverted, 44pt, spring animation)
- SecondaryButtonStyle (bordered, translucent)  
- PresetButtonStyle (with selection state)

Requirements:
- Use Swift enums with static properties
- Support Dark Mode
- Include comprehensive preview providers
- Follow exact specifications from DESIGN_QUICK_START.md Steps 1.1-2.1
- Reference design-tokens.css for values

Implement all 7 files with complete, production-ready code.
```

---

## ✅ Final Integration Prompt

```
Integrate all implemented phases into the main MonoFocus app:

1. Update ContentView.swift:
   - Add theme management (@AppStorage)
   - Replace content with new component hierarchy
   - Add StatusBarView, HomeIndicatorView
   - Setup modal overlays

2. Update/Replace TimerView.swift:
   - Use CircularTimerView instead of text display
   - Use EmptyStateView when time = 0
   - Use PresetButtonGroup, ControlButtonGroup
   - Use AutomationSection

3. Remove old implementations:
   - Old Theme.swift (migrate to DesignSystem)
   - Old button styles
   - Basic timer text display

4. Verify:
   - All existing functionality works
   - Session persistence unchanged
   - Shortcuts integration unchanged
   - Live Activities unchanged
   - No data migration needed

5. Test:
   - Timer start/pause/stop/complete flow
   - Background/foreground transitions
   - Theme switching
   - All modals
   - Dark mode
   - Accessibility

Reference: DESIGN_IMPLEMENTATION_PLAN.md Section 3 for complete integration guide.

Ensure zero breaking changes to existing functionality.
```

---

## 📝 Documentation Prompt

```
Generate comprehensive inline documentation for the implemented design system:

For each component, add:
1. File header with purpose and usage
2. Property documentation
3. Method documentation with parameters
4. Usage examples
5. Accessibility notes
6. Performance considerations

Example format:
```swift
/// A circular progress indicator for timer visualization.
///
/// Displays a 280pt diameter ring that counts down from full to empty,
/// with an animated gradient stroke and optional pulsing when paused.
///
/// - Note: Progress value should be 0.0 (empty) to 1.0 (full)
/// - Important: Supports reduced motion via UIAccessibility
///
/// # Example Usage
/// ```swift
/// CircularProgressView(progress: 0.4, isPaused: false)
/// ```
struct CircularProgressView: View {
    // Implementation...
}
```

Generate documentation for all Phase 1-7 components.
```

---

*Use these prompts as templates, adapting them to your specific development workflow and AI assistant.*
