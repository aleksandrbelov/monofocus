import Foundation
import AppIntents

/// Intent donated when a focus session starts.
/// Users can create Shortcuts automations that trigger when this intent is donated.
struct SessionDidStartIntent: AppIntent {
    static var title: LocalizedStringResource = "Session Started"
    static var description = IntentDescription(
        "Notifies when a focus session begins. Use this to trigger automations like enabling DND or grayscale.",
        categoryName: "Automation"
    )

    /// This intent is not user-invokable; it's donated by the app to trigger automations.
    static var isDiscoverable: Bool = false

    @Parameter(title: "Duration (minutes)")
    var durationMinutes: Int

    init() {
        self.durationMinutes = 25
    }

    init(durationMinutes: Int) {
        self.durationMinutes = durationMinutes
    }

    func perform() async throws -> some IntentResult {
        // Intent is donated but does nothing—user's Shortcut automation responds to it.
        return .result()
    }
}
