#if canImport(ActivityKit)
import ActivityKit
import WidgetKit
import SwiftUI

@available(iOSApplicationExtension 16.1, *)
struct TimerLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TimerAttributes.self) { context in
            TimerLiveActivityLockScreenView(context: context)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    LabelView(context: context)
                }
                DynamicIslandExpandedRegion(.center) {
                    CountdownView(context: context)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    ControlHintView(isPaused: context.state.isPaused)
                }
            } compactLeading: {
                LabelView(context: context)
            } compactTrailing: {
                CountdownCompactTrailingView(context: context)
            } minimal: {
                MinimalIndicatorView(isPaused: context.state.isPaused)
            }
        }
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct TimerLiveActivityLockScreenView: View {
    let context: ActivityViewContext<TimerAttributes>

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            LabelView(context: context)
                .font(.headline)
            if context.state.isPaused {
                Text("Paused")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                RemainingTimeText(seconds: context.state.remainingSeconds)
                    .font(.largeTitle.monospacedDigit())
            } else {
                Text("Remaining")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                CountdownView(context: context)
                    .font(.largeTitle.monospacedDigit())
            }
        }
        .padding(.vertical, 8)
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct LabelView: View {
    let context: ActivityViewContext<TimerAttributes>

    var label: String {
        if let preset = context.attributes.presetLabel, !preset.isEmpty {
            return "Focus · \(preset)"
        }
        let minutes = context.attributes.totalSeconds / 60
        return "Focus · \(minutes)m"
    }

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "timer")
            Text(label)
        }
        .foregroundStyle(.primary)
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct CountdownView: View {
    let context: ActivityViewContext<TimerAttributes>

    var body: some View {
        if context.state.isPaused {
            RemainingTimeText(seconds: context.state.remainingSeconds)
                .font(.body.monospacedDigit())
        } else {
            Text(timerInterval: Date.now...context.state.endDate, countsDown: true)
                .multilineTextAlignment(.center)
        }
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct CountdownCompactTrailingView: View {
    let context: ActivityViewContext<TimerAttributes>

    var body: some View {
        if context.state.isPaused {
            RemainingTimeText(seconds: context.state.remainingSeconds)
                .font(.caption2.monospacedDigit())
        } else {
            Text(timerInterval: Date.now...context.state.endDate, countsDown: true)
                .font(.caption2.monospacedDigit())
        }
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct MinimalIndicatorView: View {
    let isPaused: Bool

    var body: some View {
        Image(systemName: isPaused ? "pause" : "timer")
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct ControlHintView: View {
    let isPaused: Bool

    var body: some View {
        Text(isPaused ? "Resume in app" : "Tap to open MonoFocus")
            .font(.caption2)
            .foregroundStyle(.secondary)
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct RemainingTimeText: View {
    let seconds: Int

    var body: some View {
        Text(format(seconds: seconds))
    }

    private func format(seconds: Int) -> String {
        let minutesPart = seconds / 60
        let secondsPart = seconds % 60
        return String(format: "%02d:%02d", minutesPart, secondsPart)
    }
}
#endif
