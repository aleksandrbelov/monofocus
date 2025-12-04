import Foundation
import AppIntents

struct ResumeFocusSessionIntent: AppIntent {
    static var title: LocalizedStringResource = "Resume Focus Timer"
    static var description = IntentDescription(
        "Resume a paused focus session",
        categoryName: "Timer"
    )

    static var parameterSummary: some ParameterSummary {
        Summary("Resume paused timer")
    }

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let container = AppDependencyContainer.shared
        guard let timerViewModel = container.timerViewModel else {
            return .result(dialog: "MonoFocus is not ready. Please open the app first.")
        }

        guard timerViewModel.isPaused else {
            return .result(dialog: "No paused focus session to resume")
        }

        timerViewModel.resume(notificationService: container.notificationService)

        // Notify automation service about session resuming
        let remainingMinutes = timerViewModel.remainingSeconds / 60
        container.automationService?.notifySessionResume(remainingMinutes: remainingMinutes)

        return .result(dialog: "Focus session resumed with \(remainingMinutes) minutes remaining")
    }
}
