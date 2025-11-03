import SwiftUI
import UIKit

/// Animated encouragement shown when the timer has no scheduled session.
struct EmptyStateView: View {
    @State private var startDate = Date()
    @State private var reduceMotion = UIAccessibility.isReduceMotionEnabled

    private let iconSize: CGFloat = 48
    private let animationDuration: TimeInterval = 3

    var body: some View {
        VStack(spacing: Spacing.value(.md)) {
            animatedIcon

            VStack(spacing: Spacing.value(.xs)) {
                Text("Start your focus journey")
                    .font(Typography.font(.body, weight: .semibold))
                    .foregroundStyle(Color.monoForeground)
                Text("Try 30 min to stay focused")
                    .font(Typography.font(.subheadline, weight: .regular))
                    .foregroundStyle(Color.label(.secondary))
            }
            .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(Spacing.value(.lg))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("No timer running. Start your focus journey. Try 30 minute session.")
        .onAppear {
            startDate = Date()
            reduceMotion = UIAccessibility.isReduceMotionEnabled
        }
        .onReceive(NotificationCenter.default.publisher(for: UIAccessibility.reduceMotionStatusDidChangeNotification)) { _ in
            reduceMotion = UIAccessibility.isReduceMotionEnabled
        }
    }

    @ViewBuilder
    private var animatedIcon: some View {
        if reduceMotion {
            icon(offset: 0, rotation: 0)
        } else {
            TimelineView(.animation) { timeline in
                let phase = animationPhase(at: timeline.date)
                let offset = floatingOffset(for: phase)
                let rotation = rotationAngle(for: phase)
                icon(offset: offset, rotation: rotation)
            }
        }
    }

    private func icon(offset: CGFloat, rotation: Double) -> some View {
        Circle()
            .fill(Color.surface(.surface2))
            .frame(width: iconSize, height: iconSize)
            .overlay(
                Image(systemName: "timer")
                    .font(.system(size: 24, weight: .medium))
                    .foregroundStyle(Color.monoForeground)
            )
            .offset(y: offset)
            .rotationEffect(.degrees(rotation))
            .animation(.easeInOut(duration: animationDuration), value: offset)
            .animation(.easeInOut(duration: animationDuration), value: rotation)
    }

    private func animationPhase(at date: Date) -> Double {
        let elapsed = date.timeIntervalSince(startDate)
        guard elapsed > 0 else { return 0 }
        let wrapped = elapsed.truncatingRemainder(dividingBy: animationDuration)
        return wrapped / animationDuration
    }

    private func floatingOffset(for phase: Double) -> CGFloat {
        let offset = -sin(phase * .pi) * 8
        return offset
    }

    private func rotationAngle(for phase: Double) -> Double {
        sin(phase * 2 * .pi) * 5
    }
}

#if DEBUG
struct EmptyStateView_Previews: PreviewProvider {
    static var previews: some View {
        EmptyStateView()
            .padding()
            .background(Color.monoBackground)
            .previewDisplayName("Empty State")
    }
}
#endif

