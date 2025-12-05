import Foundation
import UIKit

/// Service for managing automation triggers via App Intents and URL schemes.
/// Uses URL schemes to trigger user-created Shortcuts for DND and Grayscale.
@MainActor
final class AutomationService: ObservableObject {
    private enum Keys {
        static let automationEnabled = "automationEnabled"
        static let startShortcutName = "startShortcutName"
        static let endShortcutName = "endShortcutName"
    }

    private let donationManager = IntentDonationManager()

    @Published var isAutomationEnabled: Bool {
        didSet { UserDefaults.standard.set(isAutomationEnabled, forKey: Keys.automationEnabled) }
    }
    
    @Published var startShortcutName: String {
        didSet { UserDefaults.standard.set(startShortcutName, forKey: Keys.startShortcutName) }
    }
    
    @Published var endShortcutName: String {
        didSet { UserDefaults.standard.set(endShortcutName, forKey: Keys.endShortcutName) }
    }

    init(userDefaults: UserDefaults = .standard) {
        isAutomationEnabled = userDefaults.bool(forKey: Keys.automationEnabled)
        startShortcutName = userDefaults.string(forKey: Keys.startShortcutName) ?? "MonoFocus Start"
        endShortcutName = userDefaults.string(forKey: Keys.endShortcutName) ?? "MonoFocus End"
    }

    /// Notify that a focus session has started.
    /// Donates an intent and triggers the user's start Shortcut.
    func notifySessionStart(durationMinutes: Int) {
        guard isAutomationEnabled else { return }
        donationManager.donateSessionStart(durationMinutes: durationMinutes)
        runShortcut(named: startShortcutName)
    }

    /// Notify that a focus session has completed.
    /// Donates an intent and triggers the user's end Shortcut.
    func notifySessionComplete(elapsedMinutes: Int) {
        guard isAutomationEnabled else { return }
        donationManager.donateSessionComplete(elapsedMinutes: elapsedMinutes)
        runShortcut(named: endShortcutName)
    }

    /// Notify that a focus session has resumed.
    func notifySessionResume(remainingMinutes: Int) {
        guard isAutomationEnabled else { return }
        donationManager.donateSessionResume(remainingMinutes: remainingMinutes)
        // Note: Resume doesn't re-trigger shortcuts (modes should still be active)
    }
    
    /// Notify that a focus session is about to end.
    /// Donates an intent and triggers the user's end Shortcut.
    func notifySessionWillEnd(reason: SessionEndReason) {
        guard isAutomationEnabled else { return }
        donationManager.donateSessionWillEnd(reason: reason)
        runShortcut(named: endShortcutName)
    }
    
    // MARK: - Shortcut URL Triggering
    
    /// Runs a user-created Shortcut by name using the shortcuts:// URL scheme.
    /// Uses x-callback-url format to return to MonoFocus after execution.
    private func runShortcut(named name: String) {
        guard !name.isEmpty else { return }
        
        // URL-encode the shortcut name
        guard let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            print("⚠️ Failed to encode shortcut name: \(name)")
            return
        }
        
        // Use x-callback-url format to return to app after shortcut completes
        let callbackURL = "monofocus://"
        guard let encodedCallback = callbackURL.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "shortcuts://x-callback-url/run-shortcut?name=\(encoded)&x-success=\(encodedCallback)") else {
            print("⚠️ Failed to create Shortcut URL for: \(name)")
            return
        }
        
        // Open the URL to trigger the Shortcut
        UIApplication.shared.open(url, options: [:]) { success in
            if success {
                print("✅ Triggered shortcut: \(name)")
            } else {
                print("❌ Failed to trigger shortcut: \(name)")
            }
        }
    }
    
    /// Test if a shortcut can be triggered (for setup validation).
    func testShortcut(named name: String, completion: @escaping (Bool) -> Void) {
        guard !name.isEmpty,
              let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let callbackURL = "monofocus://".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "shortcuts://x-callback-url/run-shortcut?name=\(encoded)&x-success=\(callbackURL)") else {
            completion(false)
            return
        }
        
        UIApplication.shared.open(url, options: [:], completionHandler: completion)
    }
}
