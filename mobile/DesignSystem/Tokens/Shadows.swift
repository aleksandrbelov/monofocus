import SwiftUI

/// Elevation presets pairing UIKit-aligned shadow values with SwiftUI helpers.
enum Shadows {
    static let sm = Style(radius: 2, x: 0, y: 1, opacity: 0.10)
    static let md = Style(radius: 12, x: 0, y: 4, opacity: 0.15)
    static let lg = Style(radius: 24, x: 0, y: 12, opacity: 0.20)
    static let xl = Style(radius: 48, x: 0, y: 24, opacity: 0.30)

    struct Style: Identifiable {
        public var id: CGFloat { radius }

        let radius: CGFloat
        let x: CGFloat
        let y: CGFloat
        let opacity: Double

        init(radius: CGFloat, x: CGFloat, y: CGFloat, opacity: Double) {
            self.radius = radius
            self.x = x
            self.y = y
            self.opacity = opacity
        }

        /// Applies the configured shadow to any view.
        func apply<V: View>(to view: V, color: Color = .black) -> some View {
            view.shadow(color: color.opacity(opacity), radius: radius, x: x, y: y)
        }
    }
}

extension View {
    /// Applies a design system shadow in a chaining friendly manner.
    func monoShadow(_ style: Shadows.Style, color: Color = .black) -> some View {
        style.apply(to: self, color: color)
    }
}

#if DEBUG
private struct ShadowPreviewCard: View {
    let title: String
    let style: Shadows.Style

    var body: some View {
        Text(title)
            .font(Typography.font(.callout, weight: .semibold))
            .padding(.horizontal, Spacing.value(.xl))
            .padding(.vertical, Spacing.value(.md))
            .background(Color.monoBackground)
            .clipShape(RoundedRectangle(cornerRadius: Radius.value(.lg), style: .continuous))
            .monoShadow(style)
            .padding(.vertical, Spacing.value(.sm))
    }
}

struct ShadowsPreview: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Spacing.value(.xl)) {
            ShadowPreviewCard(title: "Shadow SM", style: Shadows.sm)
            ShadowPreviewCard(title: "Shadow MD", style: Shadows.md)
            ShadowPreviewCard(title: "Shadow LG", style: Shadows.lg)
            ShadowPreviewCard(title: "Shadow XL", style: Shadows.xl)
        }
        .padding()
        .background(Color.surface(.surface2))
        .previewLayout(.sizeThatFits)
        .previewDisplayName("Shadows")
    }
}
#endif
