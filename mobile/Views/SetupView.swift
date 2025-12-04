import SwiftUI
import UIKit

struct SetupView: View {
    @EnvironmentObject var timer: TimerViewModel
    @EnvironmentObject var automation: AutomationService

    @State private var showingShareSheet = false
    @State private var csvURL: URL?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Spacing.value(.lg)) {
                Text("Setup (one time)")
                    .font(Typography.font(.title2, weight: .bold))
                    .foregroundStyle(Color.monoForeground)

                instructionsSection
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
            Text("MonoFocus uses App Intents to trigger your Shortcuts automations. Create automations in the Shortcuts app that respond to MonoFocus events:")
                .font(Typography.font(.body))
                .foregroundStyle(Color.label(.primary))

            Group {
                Text("1. **Session Start Automation**")
                Text("   - Open Shortcuts → Automations → Create Personal Automation")
                Text("   - Choose \"App\" → Select \"MonoFocus\" → \"Is Opened\"")
                Text("   - Add actions: \"Set Focus\" to turn DND on, or \"Set Color Filters\" for grayscale")

                Text("2. **Session Complete Automation**")
                Text("   - Create another automation triggered when MonoFocus is closed")
                Text("   - Add actions to turn off DND or Color Filters")
            }
            .font(Typography.font(.footnote))
            .foregroundStyle(Color.label(.secondary))
            .lineSpacing(4)

            Group {
                Text("3. **Siri Integration**")
                Text("   - Say \"Start a focus timer\" or \"Stop my focus timer\" to control MonoFocus with Siri")
                Text("   - You can also use \"Pause my focus timer\" and \"Resume my focus timer\"")
            }
            .font(Typography.font(.footnote))
            .foregroundStyle(Color.label(.secondary))
            .lineSpacing(4)

            Text("Turn automations on from the main screen to enable intent notifications. MonoFocus will donate intents when sessions start, resume, or complete.")
                .font(Typography.font(.footnote, weight: .semibold))
                .foregroundStyle(Color.label(.tertiary))

            Text("Lock Screen widgets provide 15/30/60 minute quick-start. Add them from the widget gallery after installing the app.")
                .font(Typography.font(.footnote))
                .foregroundStyle(Color.label(.tertiary))
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
}
