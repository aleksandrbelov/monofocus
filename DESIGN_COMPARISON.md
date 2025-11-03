# MonoFocus Design System Comparison

## Current iOS App vs. Target Design

### Visual Comparison Matrix

| Element | Current Implementation | Target Design | Priority |
|---------|----------------------|---------------|----------|
| **Timer Display** | • Single 72pt monospaced text<br>• Plain SF Mono font<br>• No visual container<br>• Static appearance | • 4 separate digit cards (64×80pt)<br>• Individual card backgrounds<br>• White bg on dark, black on light<br>• Elevated with shadows<br>• Spring animations on change | 🔴 Critical |
| **Progress Indicator** | ❌ None | • 280pt circular ring<br>• 6pt stroke width<br>• Linear gradient effect<br>• Smooth countdown animation<br>• Pulsing when paused | 🔴 Critical |
| **Layout Structure** | • Simple VStack<br>• Basic padding<br>• No status bar<br>• No home indicator | • Full iOS chrome simulation<br>• Status bar with real-time clock<br>• Safe area aware<br>• Home indicator at bottom<br>• Scrollable content area | 🔴 Critical |
| **Preset Buttons** | • Material background<br>• 25m, 45m, 90m<br>• Basic button style<br>• No selection state | • Translucent backgrounds (10%)<br>• 15m, 30m, 60m + custom<br>• Inverted on selection<br>• Spring-based hover/tap<br>• Custom time picker | 🟡 High |
| **Control Buttons** | • Text-only labels<br>• Basic Primary/Secondary<br>• Static appearance | • SF Symbol icons + labels<br>• Play, Pause, Stop icons<br>• Inverted primary style<br>• Border secondary style<br>• Animated state transitions | 🟡 High |
| **Automation** | • TextField for shortcut names<br>• Manual text entry<br>• "Run" buttons<br>• Basic VStack layout | • Card-based design<br>• Icon + Title + Description<br>• iOS native toggle switch<br>• Translucent background<br>• Hover states | 🟢 Medium |
| **Theme System** | ❌ None (system only) | • Manual light/dark toggle<br>• Animated sun/moon icon<br>• 90° rotation animation<br>• Top-right position<br>• Persistent preference | 🟢 Medium |
| **Empty State** | ❌ None | • Timer icon in circular bg<br>• Floating animation<br>• "Start your focus journey"<br>• Encouraging subtitle<br>• Shows when timer = 0 | 🟢 Medium |
| **Modals** | • Standard SwiftUI sheets<br>• Bottom presentation<br>• Default styling | • Centered overlays<br>• Backdrop blur<br>• Scale + fade animations<br>• Custom rounded styling<br>• Focus trapping | 🟡 High |
| **Typography** | • Basic SF Pro<br>• Limited size scale<br>• Inconsistent weights | • Complete iOS scale (11-48pt)<br>• 5 weight system<br>• Semantic naming<br>• Dynamic Type ready | 🟡 High |
| **Spacing** | • 3 values: 12, 20, 32<br>• Inconsistent application | • 9-step scale (4-48pt)<br>• 8pt grid system<br>• Consistent usage<br>• Design token driven | 🟡 High |
| **Animations** | • Basic SwiftUI defaults<br>• Minimal micro-interactions<br>• No haptics | • Spring-based throughout<br>• Scale, rotate, fade<br>• Reduced motion support<br>• Comprehensive haptics<br>• Pulsing states | 🟢 Medium |

---

## Key Design Differences

### 1. Timer Presentation

**Current:**
```
┌─────────────┐
│   25:00     │  ← Simple text
└─────────────┘
```

**Target:**
```
        ╭─────────────────╮
       ╱   ┌──┐ ┌──┐ : ┌──┐ ┌──┐   ╲  ← Circular ring
      │    │2 │ │5 │   │0 │ │0 │    │    with gradient
       ╲   └──┘ └──┘   └──┘ └──┘   ╱
        ╰─────────────────╯
         25 minutes left               ← Helper text
```

### 2. Button Hierarchy

**Current:**
```
[25m]  [45m]  [90m]          ← All same style
[Start]  [Stop]              ← Basic contrast
```

**Target:**
```
[15m]  [30m]  [60m]  [🕐]    ← Selected state inverted
    [▶ Start]  [⏹ Stop]     ← Icons + inverted primary
```

### 3. Screen Layout

**Current:**
```
┌─────────────────┐
│ MonoFocus       │  ← Title only
│                 │
│    25:00        │  ← Timer text
│                 │
│ [Presets]       │
│ [Controls]      │
│                 │
│ Automation      │
│ [Fields]        │
└─────────────────┘
```

**Target:**
```
┌─────────────────┐
│ 9:41        🔋  │  ← Status bar
├─────────────────┤
│ MonoFocus    ◑  │  ← Title + theme toggle
│                 │
│    ╭───────╮    │
│   ╱  Timer  ╲   │  ← Circular progress
│  │  [Cards]  │  │     + digit cards
│   ╲         ╱   │
│    ╰───────╯    │
│  "X min left"   │  ← Helper text
│                 │
│ [15m] [30m]...  │  ← Presets
│ [▶ Start] [⏹]   │  ← Controls
│                 │
│ ┌─────────────┐ │
│ │ 🔕 DND  [◯] │ │  ← Automation cards
│ └─────────────┘ │
├─────────────────┤
│     ▬▬▬▬▬       │  ← Home indicator
└─────────────────┘
```

---

## Color System

### Current
```swift
• Primary: Color.primary (system-defined)
• Secondary: Color.secondary (system-defined)
• Background: System default
```

### Target
```swift
• Foreground: .white (dark) / .black (light)
• Background: .black (dark) / .white (light)
• Surface: foreground @ 5-30% opacity
• Labels: foreground @ 40-100% opacity
• Inverted: background color on foreground bg
```

**Philosophy:** Pure monochrome with opacity variations

---

## Animation Specifications

### Current
```swift
.animation(.default)  // Basic default animations
```

### Target
```swift
// Button Press
.scaleEffect(isPressed ? 0.95 : 1.0)
.animation(.spring(response: 0.3, dampingFraction: 0.7), value: isPressed)

// Progress Ring
.trim(from: 0, to: progress)
.animation(.easeOut(duration: 0.5), value: progress)

// Theme Toggle
.rotationEffect(.degrees(isDark ? 0 : 90))
.opacity(isChanging ? 0 : 1)
.animation(.easeInOut(duration: 0.2), value: isDark)

// Modal Entry
.scaleEffect(isShown ? 1.0 : 0.8)
.opacity(isShown ? 1 : 0)
.animation(.spring(response: 0.4, dampingFraction: 0.8), value: isShown)

// Paused State
.opacity(isPaused ? 0.5 : 1.0)
.animation(.easeInOut(duration: 1.5).repeatForever(), value: isPaused)
```

---

## Spacing System

### Current (Limited)
```swift
Theme.spacingM: 12pt   // Small
Theme.spacingL: 20pt   // Medium  
Theme.spacingXL: 32pt  // Large
```

### Target (Complete)
```swift
Spacing.xxs: 4pt      // Minimal
Spacing.xs: 8pt       // Extra small
Spacing.sm: 12pt      // Small
Spacing.md: 16pt      // Medium (iOS standard)
Spacing.lg: 20pt      // Large
Spacing.xl: 24pt      // Extra large (page margins)
Spacing.xxl: 32pt     // Section gaps
Spacing.xxxl: 40pt    // Major sections
Spacing.xxxxl: 48pt   // Hero spacing
```

**Grid:** All spacing follows 8pt grid (multiples of 4)

---

## Accessibility Enhancements

### Current
```swift
• Basic labels
• System Dynamic Type
• Default VoiceOver
```

### Target
```swift
• Comprehensive labels
• Timer state announcements
• Keyboard navigation
• Focus management
• Reduced motion support
• High contrast mode
• Large text scaling
• VoiceOver hints
• Semantic structure
• Touch target compliance (44×44pt min)
```

---

## Implementation Complexity

### Low Effort (Days 1-3)
- Design token system
- Typography scale
- Spacing values
- Color definitions
- Button style enhancements

### Medium Effort (Days 4-7)
- Preset button redesign
- Control button icons
- Theme toggle
- Status bar
- Home indicator
- Empty state

### High Effort (Days 8-12)
- Circular progress ring
- Digit card display
- Custom modal system
- Automation card redesign
- Animation system

### Polish (Days 13-15)
- Haptic feedback
- Reduced motion
- Accessibility testing
- Performance optimization
- Edge case handling

---

## Breaking Changes

### None Expected

The new design is primarily **additive** and **visual**:

✅ **Preserved:**
- Timer logic and state management
- Session persistence format
- Shortcuts integration
- Notification system
- Live Activity interface
- Widget functionality
- User data/history

✅ **Enhanced:**
- Visual presentation layer
- Animation system
- Theme management
- Interaction feedback
- Accessibility features

❌ **No Breaking Changes:**
- No data migration required
- No API changes
- No user preference loss
- Backward compatible

---

## Testing Strategy

### Visual Regression
```
1. Capture current app screenshots
2. Build new design
3. Compare side-by-side
4. Verify design fidelity
5. Measure spacing accuracy
```

### Functional Testing
```
1. Timer start/pause/stop
2. Preset selection
3. Custom time input
4. Theme switching
5. Automation toggles
6. Modal presentations
7. Background behavior
8. Session restoration
```

### Accessibility Testing
```
1. VoiceOver navigation
2. Dynamic Type scaling
3. Reduced motion
4. Increased contrast
5. Keyboard navigation (iPad)
6. Color blindness simulation
```

### Performance Testing
```
1. Animation frame rates (60fps)
2. Memory usage monitoring
3. Battery impact measurement
4. Launch time verification
5. Background task efficiency
```

---

## Migration Checklist

### Pre-Implementation
- [ ] Design system tokens defined
- [ ] Component library structure planned
- [ ] View hierarchy mapped
- [ ] State management reviewed
- [ ] Animation specifications documented

### During Implementation
- [ ] Build in isolated branches
- [ ] Preview providers for each component
- [ ] Unit tests for calculations
- [ ] Snapshot tests for visuals
- [ ] Accessibility audit per feature

### Post-Implementation
- [ ] Side-by-side comparison
- [ ] Performance profiling
- [ ] User testing session
- [ ] Accessibility certification
- [ ] Documentation updated

---

## Quick Wins (Can Ship Independently)

1. **Design Tokens** → Immediate consistency
2. **Button Styles** → Better visual hierarchy
3. **Typography Scale** → Improved readability
4. **Empty State** → Better onboarding
5. **Status Bar** → More native feel
6. **Theme Toggle** → User preference
7. **Haptic Feedback** → Enhanced feedback

These can be implemented and released incrementally without waiting for the full redesign.

---

## Dependencies

### External
- None (all native SwiftUI/iOS SDK)

### Internal
- TimerViewModel (existing)
- ShortcutService (existing)
- NotificationService (existing)
- Theme (expand existing)

### New Components
- DesignSystem module
- CircularTimerView
- DigitCardView
- CustomModal system
- Animation library

---

## Success Criteria

### Design Fidelity
- [ ] 95%+ visual match to Figma
- [ ] All spacing within ±2pt tolerance
- [ ] Typography exactly matches scale
- [ ] Colors match specification
- [ ] Animations feel natural

### Performance
- [ ] 60fps sustained during animations
- [ ] <500ms cold launch
- [ ] <50MB memory footprint
- [ ] <2% battery per hour active

### Accessibility
- [ ] 100% VoiceOver navigable
- [ ] All WCAG AA standards met
- [ ] Full Dynamic Type support
- [ ] Keyboard navigation functional
- [ ] Reduced motion supported

### User Experience
- [ ] <10s to first timer start
- [ ] <50ms interaction latency
- [ ] Intuitive without tutorial
- [ ] No user confusion reported
- [ ] Positive feedback on aesthetics

---

*This comparison document should be used alongside DESIGN_IMPLEMENTATION_PLAN.md for complete context.*
