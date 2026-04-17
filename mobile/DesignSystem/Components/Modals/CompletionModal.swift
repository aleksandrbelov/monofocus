import SwiftUI

struct CompletionModal: View {
    @Binding var isPresented: Bool
    let onContinue: () -> Void

    var body: some View {
        CustomModal(
            isPresented: $isPresented,
            onDismiss: onContinue,
            accessibilityAnnouncement: "Well done! You've completed your focus session."
        ) {
            VStack(spacing: Spacing.value(.md)) {
                ZStack {
                    Circle()
                        .fill(Color.surface(.surface2))
                        .frame(width: 80, height: 80)
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 40, weight: .bold))
                        .foregroundStyle(Color.monoForeground)
                }
                .accessibilityHidden(true)

                VStack(spacing: 4) {
                    Text("Well Done!")
                        .font(Typography.font(.title2, weight: .bold))
                        .foregroundStyle(Color.monoForeground)
                    Text("You've completed your focus session.")
                        .font(Typography.font(.body))
                        .foregroundStyle(Color.label(.secondary))
                        .multilineTextAlignment(.center)
                }

                Button("Continue") {
                    Haptics.selection()
                    isPresented = false
                    onContinue()
                }
                .buttonStyle(.primary)
                .frame(maxWidth: .infinity)
                .accessibilityHint("Dismisses this message and returns to the timer")
            }
            .padding(Spacing.value(.xl))
        }
    }
}

#if DEBUG
struct CompletionModal_Previews: PreviewProvider {
    static var previews: some View {
        CompletionModal(isPresented: .constant(true), onContinue: {})
            .background(Color.black.opacity(0.2))
            .environmentObject(ThemeManager())
    }
}
#endif
