import SwiftUI
import UIKit

struct SetupView: View {
    @EnvironmentObject var timer: TimerViewModel
    @EnvironmentObject var shortcuts: ShortcutService

    @State private var showingShareSheet = false
    @State private var csvURL: URL?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Spacing.value(.lg)) {
                Text("Setup (one time)")
                    .font(Typography.font(.title2, weight: .bold))
                    .foregroundStyle(Color.monoForeground)

                instructionsSection
                shortcutConfigurationSection
                historyExportSection
            }
            .padding(Spacing.value(.xl))
            .background(Color.monoBackground)
        }
        .scrollIndicators(.hidden)
        .sheet(isPresented: $showingShareSheet) {
            if let url = csvURL {
                ActivityViewController(activityItems: [url])
            }
        }
    }

    private var instructionsSection: some View {
        VStack(alignment: .leading, spacing: Spacing.value(.md)) {
            Text("To let MonoFocus mute distractions and grayscale the screen during a session, create two Shortcuts:")
                .font(Typography.font(.body))
                .foregroundStyle(Color.label(.primary))

            Group {
                Text("1. **Focus / DND Shortcut**")
                Text("   - Open Shortcuts → New Shortcut → Add \"Set Focus\" → choose your focus mode (e.g., Do Not Disturb) → Turn **On**. Optionally add a \"Wait\" action followed by \"Set Focus\" **Off**.")
                Text("   - Name it `MonoFocus DND` or customize the name below.")
            }
            .font(Typography.font(.footnote))
            .foregroundStyle(Color.label(.secondary))
            .lineSpacing(4)

            Group {
                Text("2. **Grayscale Shortcut**")
                Text("   - Settings → Accessibility → Accessibility Shortcut → select **Color Filters**.")
                Text("   - In Shortcuts create: \"Set Color Filters\" → On, then \"Wait\" 25 minutes, then \"Set Color Filters\" → Off.")
                Text("   - Name it `MonoFocus Grayscale` or customize the name below.")
            }
            .font(Typography.font(.footnote))
            .foregroundStyle(Color.label(.secondary))
            .lineSpacing(4)

            Text("Turn the automations on from the main screen; MonoFocus runs enabled shortcuts whenever a session starts or resumes.")
                .font(Typography.font(.footnote, weight: .semibold))
                .foregroundStyle(Color.label(.tertiary))

            Text("Lock Screen widgets provide 15/30/60 minute quick-start. Add them from the widget gallery after installing the app.")
                .font(Typography.font(.footnote))
                .foregroundStyle(Color.label(.tertiary))
        }
    }

    private var shortcutConfigurationSection: some View {
        VStack(alignment: .leading, spacing: Spacing.value(.sm)) {
            Divider().padding(.vertical, Spacing.value(.sm))

            Text("Shortcut Names")
                .font(Typography.font(.headline, weight: .semibold))
                .foregroundStyle(Color.monoForeground)

            Text("Update these if you named your shortcuts differently. MonoFocus saves them automatically.")
                .font(Typography.font(.footnote))
                .foregroundStyle(Color.label(.secondary))

            VStack(spacing: Spacing.value(.sm)) {
                labeledField(
                    title: "Focus / DND Shortcut",
                    value: $shortcuts.dndShortcutName,
                    placeholder: "MonoFocus DND"
                )

                labeledField(
                    title: "Grayscale Shortcut",
                    value: $shortcuts.grayscaleShortcutName,
                    placeholder: "MonoFocus Grayscale"
                )
            }
        }
    }

    private var historyExportSection: some View {
        VStack(alignment: .leading, spacing: Spacing.value(.sm)) {
            Divider().padding(.vertical, Spacing.value(.sm))

            Text("History Export")
                .font(Typography.font(.headline, weight: .semibold))
                .foregroundStyle(Color.monoForeground)

            Text("Export your session history as CSV for sharing or analysis.")
                .font(Typography.font(.footnote))
                .foregroundStyle(Color.label(.secondary))

            Button("Export Session History") {
                let sessions = timer.loadSessions()
                if let url = SessionExporter.exportToCSV(sessions: sessions) {
                    csvURL = url
                    showingShareSheet = true
                }
            }
            .buttonStyle(.secondary)
        }
    }

    private func labeledField(
        title: String,
        value: Binding<String>,
        placeholder: String
    ) -> some View {
        VStack(alignment: .leading, spacing: Spacing.value(.xs)) {
            Text(title)
                .font(Typography.font(.footnote, weight: .semibold))
                .foregroundStyle(Color.label(.primary))

            TextField(placeholder, text: value)
                .textFieldStyle(.roundedBorder)
                .accessibilityLabel(title)
        }
    }
}
