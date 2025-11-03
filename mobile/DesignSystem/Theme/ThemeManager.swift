import SwiftUI

/// Handles persisted color scheme selection for the app.
@MainActor
final class ThemeManager: ObservableObject {
    @AppStorage("isDarkMode") private var isDarkModeStorage: Bool = true {
        didSet {
            applyColorScheme(from: isDarkModeStorage)
        }
    }

    @Published private(set) var colorScheme: ColorScheme = .dark

    init() {
        applyColorScheme(from: isDarkModeStorage)
    }

    /// Toggles between light and dark appearances.
    func toggle() {
        isDarkModeStorage.toggle()
    }

    /// Explicitly sets the desired color appearance.
    func setDarkMode(_ enabled: Bool) {
        guard enabled != isDarkModeStorage else { return }
        isDarkModeStorage = enabled
    }

    private func applyColorScheme(from isDarkMode: Bool) {
        withAnimation(Animations.respectingReduceMotion(Animations.easeInOut)) {
            colorScheme = isDarkMode ? .dark : .light
        }
    }
}

