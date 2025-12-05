import Foundation
import AppIntents

/// Manages donating intents to the system for Shortcuts automation.
/// When intents are donated, users' Shortcuts automations can respond to them.
@MainActor
final class IntentDonationManager {

    /// Donate an intent indicating a focus session has started.
    func donateSessionStart(durationMinutes: Int) {
        let intent = SessionDidStartIntent(durationMinutes: durationMinutes)
        Task {
            _ = try? await intent.donate()
        }
    }

    /// Donate an intent indicating a focus session has completed.
    func donateSessionComplete(elapsedMinutes: Int) {
        let intent = SessionDidCompleteIntent(elapsedMinutes: elapsedMinutes)
        Task {
            _ = try? await intent.donate()
        }
    }

    /// Donate an intent indicating a focus session has resumed.
    func donateSessionResume(remainingMinutes: Int) {
        let intent = SessionDidResumeIntent(remainingMinutes: remainingMinutes)
        Task {
            _ = try? await intent.donate()
        }
    }

    /// Donate an intent indicating a focus session is about to end.
    func donateSessionWillEnd(reason: SessionEndReason) {
        let intent = SessionWillEndIntent(reason: reason)
        Task {
            _ = try? await intent.donate()
        }
    }
}
