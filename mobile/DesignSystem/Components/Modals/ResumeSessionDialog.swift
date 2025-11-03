import SwiftUI

struct ResumeSessionDialog: View {
    @Binding var isPresented: Bool
    let remainingSeconds: Int
    let onResume: () -> Void
    let onDiscard: () -> Void

    private var minutesRemaining: Int {
        remainingSeconds / 60
    }

    private var secondsRemaining: Int {
        remainingSeconds % 60
    }

    var body: some View {
        CustomModal(isPresented: $isPresented, onDismiss: onDiscard) {
            VStack(spacing: Spacing.value(.lg)) {
                VStack(spacing: 4) {
                    Text("Resume Session?")
                        .font(Typography.font(.title2, weight: .semibold))
                        .foregroundStyle(Color.monoForeground)
                    Text("You still have \(minutesRemaining)m \(secondsRemaining)s remaining.")
                        .font(Typography.font(.body))
                        .foregroundStyle(Color.label(.secondary))
                        .multilineTextAlignment(.center)
                }

                HStack(spacing: Spacing.value(.md)) {
                    Button("Reset") {
                        Haptics.timerStop()
                        isPresented = false
                        onDiscard()
                    }
                    .buttonStyle(.secondary)

                    Button("Resume") {
                        Haptics.timerResume()
                        isPresented = false
                        onResume()
                    }
                    .buttonStyle(.primary)
                }
            }
            .padding(Spacing.value(.xl))
        }
    }
}

#if DEBUG
struct ResumeSessionDialog_Previews: PreviewProvider {
    static var previews: some View {
        ResumeSessionDialog(
            isPresented: .constant(true),
            remainingSeconds: 420,
            onResume: {},
            onDiscard: {}
        )
    }
}
#endif

