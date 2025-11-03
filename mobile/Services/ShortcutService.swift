import Foundation
import UIKit

@MainActor
final class ShortcutService: ObservableObject {
    private enum Keys {
        static let dndShortcutName = "dndShortcutName"
        static let grayscaleShortcutName = "grayscaleShortcutName"
        static let dndAutomationEnabled = "dndAutomationEnabled"
        static let grayscaleAutomationEnabled = "grayscaleAutomationEnabled"
    }

    @Published var dndShortcutName: String {
        didSet { UserDefaults.standard.set(dndShortcutName, forKey: Keys.dndShortcutName) }
    }

    @Published var grayscaleShortcutName: String {
        didSet { UserDefaults.standard.set(grayscaleShortcutName, forKey: Keys.grayscaleShortcutName) }
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
        dndShortcutName = storedDNDName?.isEmpty == false ? storedDNDName! : "MonoFocus DND"
        grayscaleShortcutName = storedGrayscaleName?.isEmpty == false ? storedGrayscaleName! : "MonoFocus Grayscale"
        isDNDAutomationEnabled = userDefaults.bool(forKey: Keys.dndAutomationEnabled)
        isGrayscaleAutomationEnabled = userDefaults.bool(forKey: Keys.grayscaleAutomationEnabled)
    }

    func save() {
        UserDefaults.standard.set(dndShortcutName, forKey: Keys.dndShortcutName)
        UserDefaults.standard.set(grayscaleShortcutName, forKey: Keys.grayscaleShortcutName)
    }

    func runShortcut(named name: String) {
        guard !name.isEmpty else { return }
        guard let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "shortcuts://run-shortcut?name=\(encoded)") else {
            return
        }
        UIApplication.shared.open(url)
    }
}
