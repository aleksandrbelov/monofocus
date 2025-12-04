import Foundation
import AppIntents

/// Intent donated when a focus session is about to end (paused or stopped).
/// Users can create Shortcuts automations that trigger when this intent is donated.
struct SessionWillEndIntent: AppIntent {
    static var title: LocalizedStringResource = "Session Will End"
    static var description = IntentDescription(
        "Notifies when a focus session is about to end (paused or stopped). Use this to trigger automations like disabling DND or grayscale.",
        categoryName: "Automation"
    )

    /// This intent is not user-invokable; it's donated by the app to trigger automations.
    static var isDiscoverable: Bool = false

    @Parameter(title: "Reason")
    var reason: SessionEndReason

    init() {
        self.reason = .stopped
    }

    init(reason: SessionEndReason) {
        self.reason = reason
    }

    func perform() async throws -> some IntentResult {
        // Intent is donated but does nothing—user's Shortcut automation responds to it.
        return .result()
    }
}
