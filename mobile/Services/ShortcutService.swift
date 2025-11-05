import Foundation
import UIKit

@MainActor
final class ShortcutService: ObservableObject {
    private enum Keys {
        static let dndShortcutName = "dndShortcutName"
        static let grayscaleShortcutName = "grayscaleShortcutName"
        static let dndOffShortcutName = "dndOffShortcutName"
        static let grayscaleOffShortcutName = "grayscaleOffShortcutName"
        static let dndAutomationEnabled = "dndAutomationEnabled"
        static let grayscaleAutomationEnabled = "grayscaleAutomationEnabled"
        static let pendingDisableDND = "pendingDisableDND"
        static let pendingDisableGrayscale = "pendingDisableGrayscale"
    }

    @Published var dndShortcutName: String {
        didSet { UserDefaults.standard.set(dndShortcutName, forKey: Keys.dndShortcutName) }
    }

    @Published var grayscaleShortcutName: String {
        didSet { UserDefaults.standard.set(grayscaleShortcutName, forKey: Keys.grayscaleShortcutName) }
    }

    @Published var dndOffShortcutName: String {
        didSet { UserDefaults.standard.set(dndOffShortcutName, forKey: Keys.dndOffShortcutName) }
    }

    @Published var grayscaleOffShortcutName: String {
        didSet { UserDefaults.standard.set(grayscaleOffShortcutName, forKey: Keys.grayscaleOffShortcutName) }
    }

    @Published var isDNDAutomationEnabled: Bool {
        didSet { UserDefaults.standard.set(isDNDAutomationEnabled, forKey: Keys.dndAutomationEnabled) }
    }

    @Published var isGrayscaleAutomationEnabled: Bool {
        didSet { UserDefaults.standard.set(isGrayscaleAutomationEnabled, forKey: Keys.grayscaleAutomationEnabled) }
    }

    init(userDefaults: UserDefaults = .standard) {
        let storedDNDName = userDefaults.string(forKey: Keys.dndShortcutName)
        let storedGrayscaleName = userDefaults.string(forKey: Keys.grayscaleShortcutName)
        let storedDNDOffName = userDefaults.string(forKey: Keys.dndOffShortcutName)
        let storedGrayscaleOffName = userDefaults.string(forKey: Keys.grayscaleOffShortcutName)
        dndShortcutName = storedDNDName?.isEmpty == false ? storedDNDName! : "MonoFocus DND"
        grayscaleShortcutName = storedGrayscaleName?.isEmpty == false ? storedGrayscaleName! : "MonoFocus Grayscale"
        dndOffShortcutName = storedDNDOffName?.isEmpty == false ? storedDNDOffName! : "MonoFocus DND Off"
        grayscaleOffShortcutName = storedGrayscaleOffName?.isEmpty == false ? storedGrayscaleOffName! : "MonoFocus Grayscale Off"
        isDNDAutomationEnabled = userDefaults.bool(forKey: Keys.dndAutomationEnabled)
        isGrayscaleAutomationEnabled = userDefaults.bool(forKey: Keys.grayscaleAutomationEnabled)
    }

    func save() {
        UserDefaults.standard.set(dndShortcutName, forKey: Keys.dndShortcutName)
        UserDefaults.standard.set(grayscaleShortcutName, forKey: Keys.grayscaleShortcutName)
        UserDefaults.standard.set(dndOffShortcutName, forKey: Keys.dndOffShortcutName)
        UserDefaults.standard.set(grayscaleOffShortcutName, forKey: Keys.grayscaleOffShortcutName)
    }

    func runShortcut(named name: String) {
        guard !name.isEmpty else { return }
        guard let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "shortcuts://run-shortcut?name=\(encoded)") else {
            return
        }
        UIApplication.shared.open(url)
    }

    /// Run the enabled "on" automations when a session starts or resumes.
    func runAutomationsOnStartOrResume() {
        if isDNDAutomationEnabled { runShortcut(named: dndShortcutName) }
        if isGrayscaleAutomationEnabled { runShortcut(named: grayscaleShortcutName) }
    }

    /// Mark pending "off" actions to be executed when safe (usually at completion or next foreground).
    func markPendingOffIfEnabled() {
        if isDNDAutomationEnabled { UserDefaults.standard.set(true, forKey: Keys.pendingDisableDND) }
        if isGrayscaleAutomationEnabled { UserDefaults.standard.set(true, forKey: Keys.pendingDisableGrayscale) }
    }

    /// Drain pending "off" actions. If onlyIfActive is true, skip when app is not active.
    func drainPendingOffIfAny(onlyIfActive: Bool = true) {
        if onlyIfActive && UIApplication.shared.applicationState != .active { return }

        let defaults = UserDefaults.standard
        if defaults.bool(forKey: Keys.pendingDisableDND) {
            runShortcut(named: dndOffShortcutName)
            defaults.set(false, forKey: Keys.pendingDisableDND)
        }
        if defaults.bool(forKey: Keys.pendingDisableGrayscale) {
            runShortcut(named: grayscaleOffShortcutName)
            defaults.set(false, forKey: Keys.pendingDisableGrayscale)
        }
    }
}
