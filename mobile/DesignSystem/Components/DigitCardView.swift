import SwiftUI

/// Individual digit card used inside the timer display.
struct DigitCardView: View {
    let digit: String

    private let cardWidth: CGFloat = 64
    private let cardHeight: CGFloat = 80

    var body: some View {
        Text(digit)
            .font(Typography.monospacedDigitFont(.display))
            .foregroundStyle(Color.monoBackground)
            .frame(width: cardWidth, height: cardHeight)
            .background(
                RoundedRectangle(cornerRadius: Radius.value(.xl), style: .continuous)
                    .fill(Color.monoForeground)
            )
            .monoShadow(Shadows.md, color: .black)
            .accessibilityHidden(true)
    }
}

#if DEBUG
struct DigitCardView_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Spacing.value(.lg)) {
            DigitCardView(digit: "0")
            DigitCardView(digit: "5")
            DigitCardView(digit: "9")
        }
        .padding()
        .background(Color.monoBackground)
        .previewLayout(.sizeThatFits)
        .previewDisplayName("Digit Cards")
    }
}
#endif
