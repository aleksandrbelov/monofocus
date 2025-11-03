import Foundation
import AppIntents
import UIKit

@available(iOS 16.0, *)
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
        if let url = URL(string: "monofocus://stop") {
            await UIApplication.shared.open(url)
        }
        return .result(dialog: "Focus session stopped")
    }
}
