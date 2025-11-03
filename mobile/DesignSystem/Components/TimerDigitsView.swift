import SwiftUI

/// MM:SS digit display assembled from digit cards.
struct TimerDigitsView: View {
    let time: Int

    private var digits: [String] {
        let minutes = max(time, 0) / 60
        let seconds = max(time, 0) % 60
        let formatted = String(format: "%02d%02d", minutes, seconds)
        return formatted.map { String($0) }
    }

    private var accessibilityString: String {
        let minutes = max(time, 0) / 60
        let seconds = max(time, 0) % 60

        var components: [String] = []
        if minutes > 0 {
            components.append("\(minutes) minute\(minutes == 1 ? "" : "s")")
        }
        components.append("\(seconds) second\(seconds == 1 ? "" : "s")")
        return components.joined(separator: " ")
    }

    var body: some View {
        HStack(spacing: Spacing.value(.sm)) {
            DigitCardView(digit: digits[safe: 0] ?? "0")
            DigitCardView(digit: digits[safe: 1] ?? "0")

            Text(":")
                .font(Typography.monospacedDigitFont(.display))
                .foregroundStyle(Color.monoForeground)
                .accessibilityHidden(true)

            DigitCardView(digit: digits[safe: 2] ?? "0")
            DigitCardView(digit: digits[safe: 3] ?? "0")
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Remaining time")
        .accessibilityValue(accessibilityString)
    }
}

private extension Array where Element == String {
    subscript(safe index: Int) -> String? {
        guard indices.contains(index) else { return nil }
        return self[index]
    }
}

#if DEBUG
struct TimerDigitsView_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Spacing.value(.lg)) {
            TimerDigitsView(time: 25 * 60)
            TimerDigitsView(time: 5)
            TimerDigitsView(time: 0)
        }
        .padding()
        .background(Color.monoBackground)
        .previewLayout(.sizeThatFits)
        .previewDisplayName("Timer Digits")
    }
}
#endif

