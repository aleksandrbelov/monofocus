import Foundation
import AppIntents

struct StopTimerIntent: AppIntent {
    static var title: LocalizedStringResource = "Stop Focus Timer"
    static var description = IntentDescription(
        "Stop the current focus session",
        categoryName: "Timer"
    )

    static var parameterSummary: some ParameterSummary {
        Summary("Stop current timer")
    }

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let container = AppDependencyContainer.shared
        guard let timerViewModel = container.timerViewModel else {
            return .result(dialog: "MonoFocus is not ready. Please open the app first.")
        }

        // Notify automation service about session ending before stopping
        container.automationService?.notifySessionWillEnd(reason: .stopped)

        timerViewModel.stop(save: true)

        return .result(dialog: "Focus session stopped")
    }
}
