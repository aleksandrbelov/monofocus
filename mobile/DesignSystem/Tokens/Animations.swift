import SwiftUI
import UIKit

/// Standard motion presets aligned with the MonoFocus interaction model.
enum Animations {
    enum Duration: Double, CaseIterable {
        case instant = 0.0
        case fast = 0.15
        case normal = 0.25
        case slow = 0.35
        case slower = 0.50

        var value: Double { rawValue }

        var label: String {
            switch self {
            case .instant:
                return "Instant"
            case .fast:
                return "Fast"
            case .normal:
                return "Normal"
            case .slow:
                return "Slow"
            case .slower:
                return "Slower"
            }
        }
    }

    static let spring = Animation.spring(response: 0.4, dampingFraction: 0.7, blendDuration: 0.0)
    static let button = Animation.spring(response: 0.3, dampingFraction: 0.7, blendDuration: 0.0)
    static let modal = Animation.spring(response: 0.4, dampingFraction: 0.8, blendDuration: 0.0)
    static let easeOut = Animation.easeOut(duration: Duration.normal.value)
    static let easeInOut = Animation.easeInOut(duration: Duration.normal.value)
    static let easeIn = Animation.easeIn(duration: Duration.fast.value)

    /// Returns `nil` when Reduce Motion is enabled so animation modifiers can opt-out gracefully.
    static func respectingReduceMotion(_ animation: Animation?) -> Animation? {
        guard let animation, !UIAccessibility.isReduceMotionEnabled else {
            return nil
        }
        return animation
    }

    /// Convenience helper for state-based animation binding.
    static func animated<Value: Equatable>(_ animation: Animation?, value: Value) -> Animation? {
        _ = value
        return respectingReduceMotion(animation)
    }
}

#if DEBUG
private struct AnimatedDot: View {
    let title: String
    let animation: Animation?

    @State private var isActive = false

    var body: some View {
        VStack(spacing: 8) {
            Circle()
                .fill(Color.monoForeground)
                .frame(width: 16, height: 16)
                .offset(x: isActive ? 60 : -60)
                .animation(Animations.respectingReduceMotion(animation), value: isActive)
            Text(title)
                .font(.caption)
                .foregroundStyle(Color.secondary)
        }
        .frame(height: 48)
        .onAppear {
            withAnimation(.linear(duration: 0.9).repeatForever(autoreverses: true)) {
                isActive = true
            }
        }
    }
}

struct AnimationsPreview: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Spacing.value(.xl)) {
            AnimatedDot(title: "Spring", animation: Animations.spring)
            AnimatedDot(title: "Ease Out", animation: Animations.easeOut)
            AnimatedDot(title: "Ease In Out", animation: Animations.easeInOut)
        }
        .padding()
        .background(Color.monoBackground)
        .previewLayout(.sizeThatFits)
        .previewDisplayName("Animations")
    }
}
#endif
