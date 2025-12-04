import Foundation
import AppIntents

/// Represents the reason a focus session ended.
enum SessionEndReason: String, AppEnum {
    case completed
    case paused
    case stopped

    static var typeDisplayRepresentation: TypeDisplayRepresentation {
        TypeDisplayRepresentation(name: "End Reason")
    }

    static var caseDisplayRepresentations: [SessionEndReason: DisplayRepresentation] {
        [
            .completed: DisplayRepresentation(title: "Completed"),
            .paused: DisplayRepresentation(title: "Paused"),
            .stopped: DisplayRepresentation(title: "Stopped")
        ]
    }
}
