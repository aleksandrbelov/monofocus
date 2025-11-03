import SwiftUI

/// Collection of automation toggles interacting with ShortcutService.
struct AutomationSection: View {
    @ObservedObject var service: ShortcutService
    let onInfo: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.value(.md)) {
            HStack {
                Text("Automation")
                    .font(Typography.font(.title3, weight: .semibold))
                    .foregroundStyle(Color.monoForeground)
                Spacer()
                Button("Setup Guide", action: onInfo)
                    .font(Typography.font(.footnote, weight: .semibold))
                    .foregroundStyle(Color.label(.secondary))
                    .padding(.horizontal, Spacing.value(.sm))
                    .padding(.vertical, 6)
                    .background(Color.surface(.surface1))
                    .clipShape(Capsule())
            }

            VStack(spacing: Spacing.value(.sm)) {
                AutomationCardView(
                    systemImage: "bell.slash.fill",
                    title: "Focus Filters",
                    description: "Enable your Do Not Disturb shortcut during sessions.",
                    isOn: $service.isDNDAutomationEnabled,
                    onToggle: handleDNDToggle
                )

                AutomationCardView(
                    systemImage: "circle.lefthalf.filled",
                    title: "Grayscale Screen",
                    description: "Automatically turn grayscale on while focusing.",
                    isOn: $service.isGrayscaleAutomationEnabled,
                    onToggle: handleGrayscaleToggle
                )
            }

            Text("MonoFocus runs these shortcuts whenever you start or resume a session.")
                .font(Typography.font(.footnote))
                .foregroundStyle(Color.label(.tertiary))
        }
    }

    private func handleDNDToggle(_ isOn: Bool) {
        (isOn ? Haptics.toggleOn : Haptics.toggleOff)()
    }

    private func handleGrayscaleToggle(_ isOn: Bool) {
        (isOn ? Haptics.toggleOn : Haptics.toggleOff)()
    }
}

#if DEBUG
struct AutomationSection_Previews: PreviewProvider {
    static var previews: some View {
        AutomationSection(service: ShortcutService(), onInfo: {})
            .padding()
            .background(Color.monoBackground)
            .previewLayout(.sizeThatFits)
    }
}
#endif
