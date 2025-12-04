import Foundation
import AppIntents

struct StartTimerIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Focus Timer"
    static var description = IntentDescription(
        "Start a focus session with a preset duration",
        categoryName: "Timer"
    )

    @Parameter(
        title: "Minutes",
        description: "Duration in minutes",
        default: 25,
        controlStyle: .field,
        inclusiveRange: (1, 180)
    )
    var minutes: Int

    static var parameterSummary: some ParameterSummary {
        Summary("Start \(\.$minutes) minute timer")
    }

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let container = AppDependencyContainer.shared
        guard let timerViewModel = container.timerViewModel else {
            return .result(dialog: "MonoFocus is not ready. Please open the app first.")
        }

        timerViewModel.setPreset(minutes: minutes)
        timerViewModel.start(notificationService: container.notificationService)

        // Notify automation service about session start
        container.automationService?.notifySessionStart(durationMinutes: minutes)

        return .result(dialog: "Starting \(minutes) minute focus session")
    }
}
