import SwiftUI

/// Collection of automation toggles interacting with AutomationService.
struct AutomationSection: View {
    @ObservedObject var service: AutomationService
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
                    systemImage: "bolt.fill",
                    title: "Focus Automations",
                    description: "Run your shortcuts when sessions start and end.",
                    isOn: $service.isAutomationEnabled,
                    onToggle: handleAutomationToggle
                )
            }

            Text("Your shortcuts will run automatically. Customize them in the Shortcuts app to include DND, Grayscale, or both.")
                .font(Typography.font(.footnote))
                .foregroundStyle(Color.label(.tertiary))
        }
    }

    private func handleAutomationToggle(_ isOn: Bool) {
        (isOn ? Haptics.toggleOn : Haptics.toggleOff)()
    }
}

#if DEBUG
struct AutomationSection_Previews: PreviewProvider {
    static var previews: some View {
        AutomationSection(service: AutomationService(), onInfo: {})
            .padding()
            .background(Color.monoBackground)
            .previewLayout(.sizeThatFits)
    }
}
#endif
