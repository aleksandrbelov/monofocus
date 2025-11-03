import SwiftUI

/// Complete circular timer assembly combining progress and digit display.
struct CircularTimerView: View {
    let time: Int
    let totalTime: Int
    let isPaused: Bool
    let isRunning: Bool

    private var progress: Double {
        guard totalTime > 0 else { return 0 }
        return max(min(Double(time) / Double(totalTime), 1), 0)
    }

    private var timeRemainingText: String {
        guard time > 0 else {
            return "Set your focus time"
        }

        let minutes = time / 60
        let seconds = time % 60

        var components: [String] = []

        if minutes > 0 {
            components.append("\(minutes) minute\(minutes == 1 ? "" : "s")")
        }

        let secondsComponent = "\(seconds) second\(seconds == 1 ? "" : "s")"
        components.append(secondsComponent)

        let description = components.joined(separator: " ")
        return "\(description) left"
    }

    private var timeRemainingAccessibility: String {
        isRunning || isPaused ? timeRemainingText : "Timer idle"
    }

    var body: some View {
        VStack(spacing: Spacing.value(.lg)) {
            ZStack {
                CircularProgressView(progress: progress, isPaused: isPaused)

                VStack(spacing: Spacing.value(.md)) {
                    if isPaused {
                        Text("PAUSED")
                            .font(Typography.font(.caption1, weight: .semibold))
                            .foregroundStyle(Color.label(.secondary))
                            .padding(.horizontal, Spacing.value(.sm))
                            .padding(.vertical, 4)
                            .background(
                                Capsule()
                                    .fill(Color.surface(.surface3))
                            )
                            .transition(
                                .asymmetric(
                                    insertion: .move(edge: .top).combined(with: .opacity),
                                    removal: .opacity
                                )
                            )
                    }

                    TimerDigitsView(time: time)
                }
            }

            Text(timeRemainingText)
                .font(Typography.font(.subheadline, weight: .medium))
                .foregroundStyle(Color.label(.tertiary))
                .accessibilityLabel("Time remaining")
                .accessibilityValue(timeRemainingAccessibility)
        }
        .animation(Animations.respectingReduceMotion(Animations.spring), value: isPaused)
    }
}

#if DEBUG
struct CircularTimerView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            CircularTimerView(time: 25 * 60, totalTime: 25 * 60, isPaused: false, isRunning: true)
                .previewDisplayName("Running Full")
            CircularTimerView(time: 6 * 60 + 30, totalTime: 25 * 60, isPaused: true, isRunning: true)
                .previewDisplayName("Paused Midway")
            CircularTimerView(time: 0, totalTime: 25 * 60, isPaused: false, isRunning: false)
                .previewDisplayName("Empty Timer")
        }
        .padding()
        .background(Color.monoBackground)
        .previewLayout(.sizeThatFits)
    }
}
#endif
