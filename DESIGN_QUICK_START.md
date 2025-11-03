# MonoFocus Design Implementation Quick Start

## 🚀 Getting Started

This is your actionable checklist for implementing the new design system. Follow in order for best results.

---

## Week 1: Foundation

### Day 1: Design Token System

**Create:** `MonoFocus/DesignSystem/Tokens/`

#### ✅ Step 1.1: Typography.swift
```swift
import SwiftUI

enum Typography {
    // Font Sizes (iOS Standard)
    static let caption2 = Font.system(size: 11)
    static let caption1 = Font.system(size: 12)
    static let footnote = Font.system(size: 13)
    static let subheadline = Font.system(size: 15)
    static let callout = Font.system(size: 16)
    static let body = Font.system(size: 17)
    static let headline = Font.system(size: 17, weight: .semibold)
    static let title3 = Font.system(size: 20)
    static let title2 = Font.system(size: 22)
    static let title1 = Font.system(size: 28)
    static let largeTitle = Font.system(size: 34, weight: .bold)
    static let display = Font.system(size: 48, weight: .bold)
    
    // Font Weights
    static let regular: Font.Weight = .regular
    static let medium: Font.Weight = .medium
    static let semibold: Font.Weight = .semibold
    static let bold: Font.Weight = .bold
    static let heavy: Font.Weight = .heavy
}
```

#### ✅ Step 1.2: Spacing.swift
```swift
import SwiftUI

enum Spacing {
    static let xxs: CGFloat = 4    // 0.5 grid units
    static let xs: CGFloat = 8     // 1 grid unit
    static let sm: CGFloat = 12    // 1.5 grid units
    static let md: CGFloat = 16    // 2 grid units
    static let lg: CGFloat = 20    // 2.5 grid units
    static let xl: CGFloat = 24    // 3 grid units (page margins)
    static let xxl: CGFloat = 32   // 4 grid units
    static let xxxl: CGFloat = 40  // 5 grid units
    static let xxxxl: CGFloat = 48 // 6 grid units
    
    // Safe Areas
    static let statusBarHeight: CGFloat = 44
    static let homeIndicatorHeight: CGFloat = 34
}
```

#### ✅ Step 1.3: Colors.swift
```swift
import SwiftUI

extension Color {
    // Semantic Colors
    static let monoForeground = Color.primary
    static let monoBackground = Color(UIColor.systemBackground)
    
    // Surface Opacity Levels
    static func surface(_ level: OpacityLevel) -> Color {
        monoForeground.opacity(level.rawValue)
    }
    
    enum OpacityLevel: Double {
        case surface1 = 0.05
        case surface2 = 0.10
        case surface3 = 0.15
        case surface4 = 0.20
        case surface5 = 0.30
        case secondary = 0.50
        case tertiary = 0.60
        case quaternary = 0.70
        case primary = 1.0
    }
}
```

#### ✅ Step 1.4: Radius.swift
```swift
import SwiftUI

enum Radius {
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 20
    static let xl: CGFloat = 24
    static let xxl: CGFloat = 28
    static let full: CGFloat = 9999
}
```

#### ✅ Step 1.5: Shadows.swift
```swift
import SwiftUI

enum Shadows {
    static let sm = Shadow(radius: 2, y: 1, opacity: 0.1)
    static let md = Shadow(radius: 12, y: 4, opacity: 0.15)
    static let lg = Shadow(radius: 24, y: 12, opacity: 0.2)
    static let xl = Shadow(radius: 48, y: 24, opacity: 0.3)
    
    struct Shadow {
        let radius: CGFloat
        let x: CGFloat
        let y: CGFloat
        let opacity: Double
        
        init(radius: CGFloat, x: CGFloat = 0, y: CGFloat, opacity: Double) {
            self.radius = radius
            self.x = x
            self.y = y
            self.opacity = opacity
        }
        
        func apply(color: Color = .black) -> some View {
            color.opacity(opacity).blur(radius: radius)
        }
    }
}
```

#### ✅ Step 1.6: Animations.swift
```swift
import SwiftUI

enum Animations {
    // Durations
    static let instant: Double = 0
    static let fast: Double = 0.15
    static let normal: Double = 0.25
    static let slow: Double = 0.35
    static let slower: Double = 0.5
    
    // Standard Animations
    static let spring = Animation.spring(response: 0.4, dampingFraction: 0.7)
    static let button = Animation.spring(response: 0.3, dampingFraction: 0.7)
    static let modal = Animation.spring(response: 0.4, dampingFraction: 0.8)
    static let easeOut = Animation.easeOut(duration: normal)
    static let easeInOut = Animation.easeInOut(duration: normal)
    
    // Reduced Motion Check
    static func withReducedMotion<V: Equatable>(_ animation: Animation?, value: V) -> Animation? {
        UIAccessibility.isReduceMotionEnabled ? nil : animation
    }
}
```

**Test:** Create preview file showing all tokens

---

### Day 2: Component Styles

#### ✅ Step 2.1: ButtonStyles.swift
```swift
import SwiftUI

// Primary Button (Inverted)
struct PrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) var isEnabled
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Typography.body.weight(.semibold))
            .foregroundColor(.monoBackground)
            .padding(.horizontal, Spacing.xxl)
            .padding(.vertical, Spacing.sm)
            .frame(minHeight: 44)
            .background(Color.monoForeground)
            .clipShape(Capsule())
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(Animations.button, value: configuration.isPressed)
            .opacity(isEnabled ? 1.0 : 0.5)
    }
}

// Secondary Button (Bordered)
struct SecondaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) var isEnabled
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Typography.body.weight(.medium))
            .foregroundColor(.monoForeground)
            .padding(.horizontal, Spacing.xxl)
            .padding(.vertical, Spacing.sm)
            .frame(minHeight: 44)
            .background(
                Capsule()
                    .strokeBorder(Color.surface(.surface4), lineWidth: 2)
            )
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(Animations.button, value: configuration.isPressed)
            .opacity(isEnabled ? 1.0 : 0.5)
    }
}

// Preset Button (Translucent with selection)
struct PresetButtonStyle: ButtonStyle {
    let isSelected: Bool
    @Environment(\.isEnabled) var isEnabled
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Typography.body.weight(.semibold))
            .foregroundColor(isSelected ? .monoBackground : .monoForeground)
            .padding(.horizontal, Spacing.xl)
            .padding(.vertical, Spacing.sm)
            .frame(minHeight: 44)
            .background(
                isSelected ? Color.monoForeground : Color.surface(.surface2)
            )
            .clipShape(Capsule())
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(Animations.button, value: configuration.isPressed)
            .opacity(isEnabled ? 1.0 : 0.5)
    }
}

extension ButtonStyle where Self == PrimaryButtonStyle {
    static var primary: PrimaryButtonStyle { PrimaryButtonStyle() }
}

extension ButtonStyle where Self == SecondaryButtonStyle {
    static var secondary: SecondaryButtonStyle { SecondaryButtonStyle() }
}
```

**Test:** Create preview with all button styles

---

## Week 2: Core Timer UI

### Day 3: Circular Progress Ring

#### ✅ Step 3.1: CircularProgressView.swift
```swift
import SwiftUI

struct CircularProgressView: View {
    let progress: Double // 0.0 to 1.0
    let isPaused: Bool
    
    private let diameter: CGFloat = 280
    private let strokeWidth: CGFloat = 6
    
    var body: some View {
        ZStack {
            // Background ring
            Circle()
                .stroke(
                    Color.surface(.surface2),
                    style: StrokeStyle(
                        lineWidth: strokeWidth,
                        lineCap: .round,
                        dash: progress == 0 ? [8, 8] : []
                    )
                )
            
            // Progress ring with gradient
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [
                            .monoForeground,
                            .monoForeground.opacity(0.6)
                        ]),
                        center: .center
                    ),
                    style: StrokeStyle(
                        lineWidth: strokeWidth,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90)) // Start from top
                .animation(Animations.easeOut, value: progress)
                .opacity(isPaused ? 0.5 : 1.0)
                .animation(
                    isPaused ? .easeInOut(duration: 1.5).repeatForever(autoreverses: true) : .default,
                    value: isPaused
                )
        }
        .frame(width: diameter, height: diameter)
    }
}
```

**Test:** Preview with various progress values

---

### Day 4: Digit Cards

#### ✅ Step 4.1: DigitCardView.swift
```swift
import SwiftUI

struct DigitCardView: View {
    let digit: String
    
    private let cardWidth: CGFloat = 64
    private let cardHeight: CGFloat = 80
    
    var body: some View {
        Text(digit)
            .font(Typography.display)
            .foregroundColor(.monoBackground)
            .frame(width: cardWidth, height: cardHeight)
            .background(Color.monoForeground)
            .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
            .shadow(
                color: Color.black.opacity(0.15),
                radius: 12,
                x: 0,
                y: 4
            )
    }
}
```

#### ✅ Step 4.2: TimerDigitsView.swift
```swift
import SwiftUI

struct TimerDigitsView: View {
    let time: Int // seconds
    
    private var formattedTime: (m1: String, m2: String, s1: String, s2: String) {
        let minutes = time / 60
        let seconds = time % 60
        return (
            String(format: "%02d", minutes).prefix(1).description,
            String(format: "%02d", minutes).suffix(1).description,
            String(format: "%02d", seconds).prefix(1).description,
            String(format: "%02d", seconds).suffix(1).description
        )
    }
    
    var body: some View {
        HStack(spacing: Spacing.sm) {
            DigitCardView(digit: formattedTime.m1)
            DigitCardView(digit: formattedTime.m2)
            
            Text(":")
                .font(Typography.display)
                .foregroundColor(.monoForeground)
            
            DigitCardView(digit: formattedTime.s1)
            DigitCardView(digit: formattedTime.s2)
        }
    }
}
```

**Test:** Preview with countdown animation

---

### Day 5: Complete Timer View

#### ✅ Step 5.1: CircularTimerView.swift
```swift
import SwiftUI

struct CircularTimerView: View {
    let time: Int // seconds
    let totalTime: Int
    let isPaused: Bool
    let isRunning: Bool
    
    private var progress: Double {
        guard totalTime > 0 else { return 0 }
        return Double(totalTime - time) / Double(totalTime)
    }
    
    private var timeRemainingText: String {
        guard time > 0 else { return "Set your focus time" }
        let minutes = time / 60
        let seconds = time % 60
        
        if minutes == 0 {
            return "\(seconds) second\(seconds != 1 ? "s" : "") left"
        } else if seconds == 0 {
            return "\(minutes) minute\(minutes != 1 ? "s" : "") left"
        } else {
            return "\(minutes)m \(seconds)s left"
        }
    }
    
    var body: some View {
        VStack(spacing: Spacing.md) {
            // Paused indicator
            if isPaused {
                Text("PAUSED")
                    .font(Typography.footnote.weight(.semibold))
                    .foregroundColor(.monoForeground)
                    .padding(.horizontal, Spacing.md)
                    .padding(.vertical, 6)
                    .background(Color.surface(.surface4))
                    .clipShape(Capsule())
                    .transition(.scale.combined(with: .opacity))
            }
            
            // Timer with progress ring
            ZStack {
                CircularProgressView(
                    progress: progress,
                    isPaused: isPaused
                )
                
                TimerDigitsView(time: time)
            }
            
            // Time remaining text
            Text(timeRemainingText)
                .font(Typography.subheadline.weight(.medium))
                .foregroundColor(.surface(.tertiary))
        }
        .animation(Animations.spring, value: isPaused)
    }
}
```

**Test:** Full timer functionality preview

---

## Week 3: Controls & Interaction

### Day 6: Preset Buttons

#### ✅ Step 6.1: PresetButtonGroup.swift
```swift
import SwiftUI

struct PresetButtonGroup: View {
    @Binding var selectedTime: Int // in seconds
    let onCustomTap: () -> Void
    let isDisabled: Bool
    
    private let presets = [
        (label: "15m", value: 15 * 60),
        (label: "30m", value: 30 * 60),
        (label: "60m", value: 60 * 60)
    ]
    
    var body: some View {
        HStack(spacing: Spacing.sm) {
            ForEach(presets, id: \.value) { preset in
                Button(preset.label) {
                    if !isDisabled {
                        selectedTime = preset.value
                        Haptics.selection()
                    }
                }
                .buttonStyle(PresetButtonStyle(isSelected: selectedTime == preset.value))
                .disabled(isDisabled)
            }
            
            Button {
                if !isDisabled {
                    onCustomTap()
                    Haptics.selection()
                }
            } label: {
                Image(systemName: "clock")
                    .font(.system(size: 20))
            }
            .buttonStyle(PresetButtonStyle(isSelected: false))
            .disabled(isDisabled)
        }
    }
}
```

**Test:** Preview with selection states

---

### Day 7: Control Buttons

#### ✅ Step 7.1: ControlButtonGroup.swift
```swift
import SwiftUI

struct ControlButtonGroup: View {
    let isRunning: Bool
    let isPaused: Bool
    let onStart: () -> Void
    let onPause: () -> Void
    let onResume: () -> Void
    let onStop: () -> Void
    
    var body: some View {
        HStack(spacing: Spacing.md) {
            // Primary action button
            if !isRunning {
                Button {
                    onStart()
                    Haptics.timerStart()
                } label: {
                    Label("Start", systemImage: "play.fill")
                }
                .buttonStyle(.primary)
            } else if isPaused {
                Button {
                    onResume()
                    Haptics.timerStart()
                } label: {
                    Label("Resume", systemImage: "play.fill")
                }
                .buttonStyle(.primary)
            } else {
                Button {
                    onPause()
                    Haptics.timerPause()
                } label: {
                    Label("Pause", systemImage: "pause.fill")
                }
                .buttonStyle(.primary)
            }
            
            // Stop button (when running or paused)
            if isRunning || isPaused {
                Button {
                    onStop()
                    Haptics.timerStop()
                } label: {
                    Label("Stop", systemImage: "stop.fill")
                }
                .buttonStyle(.secondary)
                .transition(.scale.combined(with: .opacity))
            }
        }
        .animation(Animations.spring, value: isRunning)
        .animation(Animations.spring, value: isPaused)
    }
}
```

**Test:** State transitions preview

---

## Quick Implementation Guide

### Priority Order

**Must Have (MVP):**
1. ✅ Design tokens (Day 1)
2. ✅ Circular timer with cards (Days 3-5)
3. ✅ Button styles (Day 2, 6-7)
4. ✅ Status bar + home indicator

**Should Have:**
5. ✅ Theme toggle
6. ✅ Empty state
7. ✅ Automation redesign
8. ✅ Custom modals

**Nice to Have:**
9. ✅ Advanced animations
10. ✅ Haptic refinements
11. ✅ Accessibility polish

---

## Testing Commands

```bash
# Run in Xcode
# 1. Build: Cmd + B
# 2. Run: Cmd + R
# 3. Preview: Opt + Cmd + Return

# Test on simulators:
# - iPhone SE (small)
# - iPhone 14 Pro (standard)
# - iPhone 14 Pro Max (large)
# - iPad Pro (keyboard)

# Accessibility testing:
# - Xcode > Accessibility Inspector
# - Settings > Accessibility > VoiceOver
# - Settings > Display & Brightness > Text Size
```

---

## Common Pitfalls

❌ **Don't:**
- Skip design tokens (foundation is critical)
- Test only on one device size
- Ignore reduced motion
- Forget haptic feedback
- Hard-code spacing/colors

✅ **Do:**
- Follow 8pt grid strictly
- Test dark mode constantly
- Use preview providers
- Profile performance early
- Document as you go

---

## Resources

- **Design Reference:** `/design/MonoFocus iOS App Design/`
- **Implementation Plan:** `DESIGN_IMPLEMENTATION_PLAN.md`
- **Comparison Doc:** `DESIGN_COMPARISON.md`
- **Figma:** [Original Design](https://www.figma.com/design/JB3bLW2tBfjWAeoyx5pzYu/)

---

## Need Help?

**Stuck on animations?** → Check `Animations.swift` presets
**Spacing looks off?** → Verify 8pt grid adherence
**Dark mode issues?** → Test with `Color.surface()` helpers
**Performance lag?** → Profile with Instruments

---

*Start with Day 1 and work sequentially. Each step builds on the previous. Good luck! 🚀*
