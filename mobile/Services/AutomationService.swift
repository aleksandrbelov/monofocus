import Foundation

/// Service for managing automation triggers via App Intents.
/// Replaces the legacy ShortcutService that used URL schemes.
@MainActor
final class AutomationService: ObservableObject {
    private enum Keys {
        static let dndAutomationEnabled = "dndAutomationEnabled"
        static let grayscaleAutomationEnabled = "grayscaleAutomationEnabled"
    }

    private let donationManager = IntentDonationManager()

    @Published var isDNDAutomationEnabled: Bool {
        didSet { UserDefaults.standard.set(isDNDAutomationEnabled, forKey: Keys.dndAutomationEnabled) }
    }

    @Published var isGrayscaleAutomationEnabled: Bool {
        didSet { UserDefaults.standard.set(isGrayscaleAutomationEnabled, forKey: Keys.grayscaleAutomationEnabled) }
    }

    init(userDefaults: UserDefaults = .standard) {
        isDNDAutomationEnabled = userDefaults.bool(forKey: Keys.dndAutomationEnabled)
        isGrayscaleAutomationEnabled = userDefaults.bool(forKey: Keys.grayscaleAutomationEnabled)
    }

    /// Notify that a focus session has started.
    /// Donates an intent that user's Shortcuts automations can respond to.
    func notifySessionStart(durationMinutes: Int) {
        guard isDNDAutomationEnabled || isGrayscaleAutomationEnabled else { return }
        donationManager.donateSessionStart(durationMinutes: durationMinutes)
    }

    /// Notify that a focus session has completed.
    /// Donates an intent that user's Shortcuts automations can respond to.
    func notifySessionComplete(elapsedMinutes: Int) {
        guard isDNDAutomationEnabled || isGrayscaleAutomationEnabled else { return }
        donationManager.donateSessionComplete(elapsedMinutes: elapsedMinutes)
    }

    /// Notify that a focus session has resumed.
    /// Donates an intent that user's Shortcuts automations can respond to.
    func notifySessionResume(remainingMinutes: Int) {
        guard isDNDAutomationEnabled || isGrayscaleAutomationEnabled else { return }
        donationManager.donateSessionResume(remainingMinutes: remainingMinutes)
    }

    /// Notify that a focus session is about to end.
    /// Donates an intent that user's Shortcuts automations can respond to.
    func notifySessionWillEnd(reason: SessionEndReason) {
        guard isDNDAutomationEnabled || isGrayscaleAutomationEnabled else { return }
        donationManager.donateSessionWillEnd(reason: reason)
    }
}
