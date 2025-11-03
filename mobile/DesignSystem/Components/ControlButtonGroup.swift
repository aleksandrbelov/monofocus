import SwiftUI

/// Primary timer control buttons with state-aware actions.
struct ControlButtonGroup: View {
    let isRunning: Bool
    let isPaused: Bool
    let onStart: () -> Void
    let onPause: () -> Void
    let onResume: () -> Void
    let onStop: () -> Void

    var body: some View {
        HStack(spacing: Spacing.value(.md)) {
            primaryActionButton

            if isRunning || isPaused {
                Button {
                    Haptics.timerStop()
                    onStop()
                } label: {
                    Label("Stop", systemImage: "stop.fill")
                        .labelStyle(.titleAndIcon)
                }
                .buttonStyle(.secondary)
                .transition(.scale.combined(with: .opacity))
            }
        }
        .animation(Animations.respectingReduceMotion(Animations.spring), value: isRunning)
        .animation(Animations.respectingReduceMotion(Animations.spring), value: isPaused)
    }

    @ViewBuilder
    private var primaryActionButton: some View {
        if !isRunning && !isPaused {
            Button {
                Haptics.timerStart()
                onStart()
            } label: {
                Label("Start", systemImage: "play.fill")
                    .labelStyle(.titleAndIcon)
            }
            .buttonStyle(.primary)
        } else if isPaused {
            Button {
                Haptics.timerResume()
                onResume()
            } label: {
                Label("Resume", systemImage: "play.fill")
                    .labelStyle(.titleAndIcon)
            }
            .buttonStyle(.primary)
        } else {
            Button {
                Haptics.timerPause()
                onPause()
            } label: {
                Label("Pause", systemImage: "pause.fill")
                    .labelStyle(.titleAndIcon)
            }
            .buttonStyle(.primary)
        }
    }
}

#if DEBUG
struct ControlButtonGroup_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Spacing.value(.xl)) {
            ControlButtonGroup(isRunning: false, isPaused: false, onStart: {}, onPause: {}, onResume: {}, onStop: {})
            ControlButtonGroup(isRunning: true, isPaused: false, onStart: {}, onPause: {}, onResume: {}, onStop: {})
            ControlButtonGroup(isRunning: false, isPaused: true, onStart: {}, onPause: {}, onResume: {}, onStop: {})
        }
        .padding()
        .background(Color.monoBackground)
        .previewLayout(.sizeThatFits)
    }
}
#endif

