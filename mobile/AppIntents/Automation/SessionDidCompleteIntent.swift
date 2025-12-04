import Foundation
import AppIntents

/// Intent donated when a focus session completes.
/// Users can create Shortcuts automations that trigger when this intent is donated.
struct SessionDidCompleteIntent: AppIntent {
    static var title: LocalizedStringResource = "Session Completed"
    static var description = IntentDescription(
        "Notifies when a focus session completes. Use this to trigger automations like disabling DND or grayscale.",
        categoryName: "Automation"
    )

    /// This intent is not user-invokable; it's donated by the app to trigger automations.
    static var isDiscoverable: Bool = false

    @Parameter(title: "Elapsed Minutes")
    var elapsedMinutes: Int

    init() {
        self.elapsedMinutes = 0
    }

    init(elapsedMinutes: Int) {
        self.elapsedMinutes = elapsedMinutes
    }

    func perform() async throws -> some IntentResult {
        // Intent is donated but does nothing—user's Shortcut automation responds to it.
        return .result()
    }
}
