import SwiftUI

/// Animated theme toggle button switching between light and dark appearances.
struct ThemeToggle: View {
    @EnvironmentObject private var themeManager: ThemeManager
    @State private var isPressed = false

    private let size: CGFloat = 44

    private var isDarkMode: Bool {
        themeManager.colorScheme == .dark
    }

    var body: some View {
        Button {
            let newValue = !isDarkMode
            if newValue {
                Haptics.toggleOn()
            } else {
                Haptics.toggleOff()
            }
            withAnimation(Animations.respectingReduceMotion(Animations.easeInOut)) {
                themeManager.setDarkMode(newValue)
            }
        } label: {
            ZStack {
                Image(systemName: "sun.max.fill")
                    .symbolRenderingMode(.hierarchical)
                    .font(.system(size: 20, weight: .semibold))
                    .rotationEffect(.degrees(isDarkMode ? -90 : 0))
                    .opacity(isDarkMode ? 0 : 1)

                Image(systemName: "moon.fill")
                    .symbolRenderingMode(.hierarchical)
                    .font(.system(size: 20, weight: .semibold))
                    .rotationEffect(.degrees(isDarkMode ? 0 : 90))
                    .opacity(isDarkMode ? 1 : 0)
            }
            .frame(width: size, height: size)
            .background(Color.surface(.surface2))
            .clipShape(Circle())
        }
        .buttonStyle(.plain)
        .scaleEffect(isPressed ? 0.96 : 1.0)
        .animation(Animations.respectingReduceMotion(Animations.button), value: isPressed)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
        .accessibilityLabel(isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode")
        .accessibilityHint("Toggles the MonoFocus theme")
    }
}

#if DEBUG
struct ThemeToggle_Previews: PreviewProvider {
    static var previews: some View {
        let manager = ThemeManager()
        return ThemeToggle()
            .environmentObject(manager)
            .padding()
            .background(Color.monoBackground)
            .previewLayout(.sizeThatFits)
    }
}
#endif

