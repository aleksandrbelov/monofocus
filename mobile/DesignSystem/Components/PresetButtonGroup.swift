import SwiftUI

/// Displays preset focus durations with custom time entry affordance.
struct PresetButtonGroup: View {
    @Binding var selectedTime: Int // seconds
    let isDisabled: Bool
    let onCustomTap: () -> Void

    private let presets: [(label: String, value: Int)] = [
        ("15m", 15 * 60),
        ("30m", 30 * 60),
        ("60m", 60 * 60)
    ]

    var body: some View {
        HStack(spacing: Spacing.value(.sm)) {
            ForEach(presets, id: \.value) { preset in
                Button(preset.label) {
                    guard !isDisabled else { return }
                    selectedTime = preset.value
                    Haptics.selection()
                }
                .buttonStyle(PresetButtonStyle(isSelected: selectedTime == preset.value))
                .disabled(isDisabled)
            }

            Button {
                guard !isDisabled else { return }
                Haptics.selection()
                onCustomTap()
            } label: {
                Image(systemName: "clock")
                    .font(.system(size: 18, weight: .semibold))
                    .frame(width: Spacing.touchTargetMinimum, height: Spacing.touchTargetMinimum)
            }
            .buttonStyle(PresetButtonStyle(isSelected: false))
            .disabled(isDisabled)
            .accessibilityLabel("Choose custom duration")
        }
    }
}

#if DEBUG
struct PresetButtonGroup_Previews: PreviewProvider {
    struct Container: View {
        @State var selected: Int = 15 * 60

        var body: some View {
            PresetButtonGroup(selectedTime: $selected, isDisabled: false, onCustomTap: {})
                .padding()
                .background(Color.monoBackground)
        }
    }

    static var previews: some View {
        Container()
            .previewLayout(.sizeThatFits)
    }
}
#endif

