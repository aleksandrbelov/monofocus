import SwiftUI
import UIKit

/// Semantic color palette for the MonoFocus experience.
enum Colors {
    static let monoForeground = Color(dynamic: .monoForeground)
    static let monoBackground = Color(dynamic: .monoBackground)

    enum SurfaceOpacity: Double, CaseIterable, Identifiable {
        case surface1 = 0.05
        case surface2 = 0.10
        case surface3 = 0.15
        case surface4 = 0.20
        case surface5 = 0.30

        var id: Double { rawValue }

        var label: String {
            switch self {
            case .surface1:
                return "Surface 1"
            case .surface2:
                return "Surface 2"
            case .surface3:
                return "Surface 3"
            case .surface4:
                return "Surface 4"
            case .surface5:
                return "Surface 5"
            }
        }
    }

    enum LabelOpacity: Double, CaseIterable, Identifiable {
        case disabled = 0.30
        case secondary = 0.50
        case tertiary = 0.60
        case quaternary = 0.70
        case primary = 1.0

        var id: Double { rawValue }

        var label: String {
            switch self {
            case .disabled:
                return "Disabled"
            case .secondary:
                return "Secondary"
            case .tertiary:
                return "Tertiary"
            case .quaternary:
                return "Quaternary"
            case .primary:
                return "Primary"
            }
        }
    }

    /// Returns a foreground-derived surface color at the provided opacity.
    static func surface(_ level: SurfaceOpacity) -> Color {
        monoForeground.opacity(level.rawValue)
    }

    /// Returns a label color that adapts to dark/light mode while respecting opacity.
    static func label(_ level: LabelOpacity) -> Color {
        monoForeground.opacity(level.rawValue)
    }
}

extension Color {
    static let monoForeground = Colors.monoForeground
    static let monoBackground = Colors.monoBackground

    static func surface(_ level: Colors.SurfaceOpacity) -> Color {
        Colors.surface(level)
    }

    static func label(_ level: Colors.LabelOpacity) -> Color {
        Colors.label(level)
    }
}

private extension Color {
    init(dynamic: UIColor) {
        self.init(uiColor: dynamic)
    }
}

private extension UIColor {
    static let monoForeground = UIColor { trait in
        switch trait.userInterfaceStyle {
        case .dark:
            return .white
        default:
            return .black
        }
    }

    static let monoBackground = UIColor { trait in
        switch trait.userInterfaceStyle {
        case .dark:
            return .black
        default:
            return .white
        }
    }
}

#if DEBUG
private struct ColorSwatch: View {
    let title: String
    let color: Color

    var body: some View {
        HStack {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(color)
                .frame(width: 48, height: 48)
                .overlay(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .strokeBorder(Color.surface(.surface2), lineWidth: 1)
                )
            Text(title)
                .font(.body)
                .foregroundStyle(Color.label(.primary))
            Spacer()
        }
        .padding(.vertical, 6)
    }
}

struct ColorsPreview: PreviewProvider {
    static var previews: some View {
        Group {
            VStack(alignment: .leading, spacing: 12) {
                Text("Semantic Colors")
                    .font(.headline)
                ColorSwatch(title: "Foreground", color: .monoForeground)
                ColorSwatch(title: "Background", color: .monoBackground)
                Divider()
                Text("Surface Opacity")
                    .font(.headline)
                ForEach(Colors.SurfaceOpacity.allCases) { level in
                    ColorSwatch(title: level.label, color: .surface(level))
                }
                Divider()
                Text("Label Opacity")
                    .font(.headline)
                ForEach(Colors.LabelOpacity.allCases) { level in
                    ColorSwatch(title: level.label, color: .label(level))
                }
            }
            .padding()
            .background(Color.monoBackground)
        }
        .previewLayout(.sizeThatFits)
        .previewDisplayName("Colors")
    }
}
#endif

