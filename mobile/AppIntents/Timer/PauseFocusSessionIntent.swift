import Foundation
import AppIntents

struct PauseFocusSessionIntent: AppIntent {
    static var title: LocalizedStringResource = "Pause Focus Timer"
    static var description = IntentDescription(
        "Pause the current focus session",
        categoryName: "Timer"
    )

    static var parameterSummary: some ParameterSummary {
        Summary("Pause current timer")
    }

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let container = AppDependencyContainer.shared
        guard let timerViewModel = container.timerViewModel else {
            return .result(dialog: "MonoFocus is not ready. Please open the app first.")
        }

        guard timerViewModel.isRunning else {
            return .result(dialog: "No active focus session to pause")
        }

        // Notify automation service about session pausing
        container.automationService?.notifySessionWillEnd(reason: .paused)

        timerViewModel.pause()

        let remainingMinutes = timerViewModel.remainingSeconds / 60
        return .result(dialog: "Focus session paused with \(remainingMinutes) minutes remaining")
    }
}
