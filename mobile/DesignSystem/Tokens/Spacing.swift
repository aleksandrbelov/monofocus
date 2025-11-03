import SwiftUI

/// MonoFocus spacing scale following the 8pt grid.
enum Spacing {
    enum Level: CGFloat, CaseIterable, Identifiable {
        case xxs = 4
        case xs = 8
        case sm = 12
        case md = 16
        case lg = 20
        case xl = 24
        case xxl = 32
        case xxxl = 40
        case xxxxl = 48

        var id: CGFloat { rawValue }

        var label: String {
            switch self {
            case .xxs:
                return "XXS"
            case .xs:
                return "XS"
            case .sm:
                return "SM"
            case .md:
                return "MD"
            case .lg:
                return "LG"
            case .xl:
                return "XL"
            case .xxl:
                return "XXL"
            case .xxxl:
                return "XXXL"
            case .xxxxl:
                return "XXXXL"
            }
        }
    }

    /// Returns the raw spacing value to preserve call-site clarity.
    static func value(_ level: Level) -> CGFloat {
        level.rawValue
    }

    // Safe area constants
    static let statusBarHeight: CGFloat = 44
    static let homeIndicatorHeight: CGFloat = 34

    // Touch target guidance
    static let touchTargetMinimum: CGFloat = 44
    static let touchTargetComfortable: CGFloat = 48
}

#if DEBUG
private struct SpacingPreviewRow: View {
    let level: Spacing.Level

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("\(level.label) – \(Int(level.rawValue))pt")
                .font(.caption)
                .foregroundStyle(Color.secondary)
            Rectangle()
                .fill(Color.monoForeground.opacity(0.15))
                .frame(height: level.rawValue)
                .overlay(
                    Text("\(Int(level.rawValue))")
                        .font(.caption2)
                        .foregroundStyle(Color.secondary)
                )
        }
        .padding(.vertical, 4)
    }
}

struct SpacingPreview: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                ForEach(Spacing.Level.allCases) { level in
                    SpacingPreviewRow(level: level)
                }
                Divider()
                VStack(alignment: .leading, spacing: 8) {
                    Text("Safe Areas")
                        .font(.headline)
                    Text("Status Bar: \(Int(Spacing.statusBarHeight))pt")
                    Text("Home Indicator: \(Int(Spacing.homeIndicatorHeight))pt")
                    Text("Touch Target Minimum: \(Int(Spacing.touchTargetMinimum))pt")
                }
                .font(.subheadline)
            }
            .padding()
        }
        .preferredColorScheme(.light)
        .previewDisplayName("Spacing Scale")
    }
}
#endif

