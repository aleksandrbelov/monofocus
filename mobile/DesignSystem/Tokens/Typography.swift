import SwiftUI
import UIKit

/// MonoFocus typography scale mapped to iOS Dynamic Type.
enum Typography {
    /// Supported text styles using the iOS system scale.
    enum Style: CGFloat, CaseIterable, Identifiable {
        case caption2 = 11
        case caption1 = 12
        case footnote = 13
        case subheadline = 15
        case callout = 16
        case body = 17
        case headline = 17.1
        case title3 = 20
        case title2 = 22
        case title1 = 28
        case largeTitle = 34
        case display = 48

        var id: CGFloat { rawValue }

        /// Maps to the closest Dynamic Type text style.
        var textStyle: UIFont.TextStyle {
            switch self {
            case .caption2:
                return .caption2
            case .caption1:
                return .caption1
            case .footnote:
                return .footnote
            case .subheadline:
                return .subheadline
            case .callout:
                return .callout
            case .body:
                return .body
            case .headline:
                return .headline
            case .title3:
                return .title3
            case .title2:
                return .title2
            case .title1:
                return .title1
            case .largeTitle:
                return .largeTitle
            case .display:
                return .largeTitle
            }
        }

        /// Human readable label for previews.
        var label: String {
            switch self {
            case .caption2:
                return "Caption 2"
            case .caption1:
                return "Caption 1"
            case .footnote:
                return "Footnote"
            case .subheadline:
                return "Subheadline"
            case .callout:
                return "Callout"
            case .body:
                return "Body"
            case .headline:
                return "Headline"
            case .title3:
                return "Title 3"
            case .title2:
                return "Title 2"
            case .title1:
                return "Title 1"
            case .largeTitle:
                return "Large Title"
            case .display:
                return "Display"
            }
        }
    }

    /// Weight presets aligned with SF Pro Text.
    enum Weight: CaseIterable {
        case regular
        case medium
        case semibold
        case bold
        case heavy

        var fontWeight: Font.Weight {
            switch self {
            case .regular:
                return .regular
            case .medium:
                return .medium
            case .semibold:
                return .semibold
            case .bold:
                return .bold
            case .heavy:
                return .heavy
            }
        }

        var uiFontWeight: UIFont.Weight {
            switch self {
            case .regular:
                return .regular
            case .medium:
                return .medium
            case .semibold:
                return .semibold
            case .bold:
                return .bold
            case .heavy:
                return .heavy
            }
        }
    }

    /// Returns a Dynamic Type aware SwiftUI font with the given style and weight.
    static func font(_ style: Style, weight: Weight = .regular, design: UIFontDescriptor.SystemDesign = .default) -> Font {
        let baseFont = UIFont.systemFont(ofSize: style.rawValue, weight: weight.uiFontWeight)
        let descriptor = baseFont.fontDescriptor.withDesign(design) ?? baseFont.fontDescriptor
        let designedFont = UIFont(descriptor: descriptor, size: style.rawValue)
        let metrics = UIFontMetrics(forTextStyle: style.textStyle)
        let scaledFont = metrics.scaledFont(for: designedFont)
        return Font(scaledFont)
    }

    /// Monospaced digit variant useful for timers and counters.
    static func monospacedDigitFont(_ style: Style, weight: Weight = .semibold) -> Font {
        font(style, weight: weight).monospacedDigit()
    }
}

#if DEBUG
private struct TypographyPreviewRow: View {
    let style: Typography.Style

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(style.label)
                .font(.caption)
                .foregroundStyle(Color.secondary)
            HStack(spacing: 16) {
                Text("Regular")
                    .font(Typography.font(style))
                Text("Semibold")
                    .font(Typography.font(style, weight: .semibold))
                Text("Digits 12:45")
                    .font(Typography.monospacedDigitFont(style))
            }
        }
        .padding(.vertical, 4)
    }
}

struct TypographyPreview: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                ForEach(Typography.Style.allCases) { style in
                    TypographyPreviewRow(style: style)
                }
            }
            .padding()
        }
        .previewDisplayName("Typography Scale")
    }
}
#endif
