import Foundation
import AppIntents

/// Intent donated when a focus session resumes after being paused.
/// Users can create Shortcuts automations that trigger when this intent is donated.
struct SessionDidResumeIntent: AppIntent {
    static var title: LocalizedStringResource = "Session Resumed"
    static var description = IntentDescription(
        "Notifies when a focus session resumes. Use this to trigger automations like re-enabling DND or grayscale.",
        categoryName: "Automation"
    )

    /// This intent is not user-invokable; it's donated by the app to trigger automations.
    static var isDiscoverable: Bool = false

    @Parameter(title: "Remaining Minutes")
    var remainingMinutes: Int

    init() {
        self.remainingMinutes = 0
    }

    init(remainingMinutes: Int) {
        self.remainingMinutes = remainingMinutes
    }

    func perform() async throws -> some IntentResult {
        // Intent is donated but does nothing—user's Shortcut automation responds to it.
        return .result()
    }
}
