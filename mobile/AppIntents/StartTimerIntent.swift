import Foundation
import AppIntents
import UIKit

@available(iOS 16.0, *)
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
        if let url = URL(string: "monofocus://start?minutes=\(minutes)") {
            await UIApplication.shared.open(url)
        }
        return .result(dialog: "Starting \(minutes) minute focus session")
    }
}
