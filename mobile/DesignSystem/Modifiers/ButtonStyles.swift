import SwiftUI

/// Inverted primary action button with spring press feedback.
struct PrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Typography.font(.body, weight: .semibold))
            .foregroundStyle(Color.monoBackground)
            .padding(.horizontal, Spacing.value(.xxl))
            .padding(.vertical, Spacing.value(.sm))
            .frame(minHeight: Spacing.touchTargetMinimum)
            .background(Color.monoForeground)
            .clipShape(Capsule())
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(isEnabled ? 1.0 : Colors.LabelOpacity.disabled.rawValue)
            .animation(Animations.respectingReduceMotion(Animations.button), value: configuration.isPressed)
    }
}

/// Bordered translucent secondary button for less prominent actions.
struct SecondaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Typography.font(.body, weight: .medium))
            .foregroundStyle(Color.monoForeground)
            .padding(.horizontal, Spacing.value(.xxl))
            .padding(.vertical, Spacing.value(.sm))
            .frame(minHeight: Spacing.touchTargetMinimum)
            .background(
                Capsule()
                    .strokeBorder(Color.surface(.surface4), lineWidth: 2)
                    .background(
                        Capsule()
                            .fill(Color.surface(.surface2))
                    )
            )
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(isEnabled ? 1.0 : Colors.LabelOpacity.disabled.rawValue)
            .animation(Animations.respectingReduceMotion(Animations.button), value: configuration.isPressed)
    }
}

/// Preset pill button with selection state styling.
struct PresetButtonStyle: ButtonStyle {
    let isSelected: Bool
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Typography.font(.body, weight: .semibold))
            .foregroundStyle(isSelected ? Color.monoBackground : Color.monoForeground)
            .padding(.horizontal, Spacing.value(.xl))
            .padding(.vertical, Spacing.value(.sm))
            .frame(minHeight: Spacing.touchTargetMinimum)
            .background(
                Capsule()
                    .fill(isSelected ? Color.monoForeground : Color.surface(.surface2))
            )
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(isEnabled ? 1.0 : Colors.LabelOpacity.disabled.rawValue)
            .animation(Animations.respectingReduceMotion(Animations.button), value: configuration.isPressed)
    }
}

extension ButtonStyle where Self == PrimaryButtonStyle {
    static var primary: PrimaryButtonStyle { PrimaryButtonStyle() }
}

extension ButtonStyle where Self == SecondaryButtonStyle {
    static var secondary: SecondaryButtonStyle { SecondaryButtonStyle() }
}

#if DEBUG
private struct ButtonStylesPreview: View {
    @State private var selectedPreset = 30

    let presets = [15, 30, 60]

    var body: some View {
        VStack(spacing: Spacing.value(.xl)) {
            Button("Start Focus") {}
                .buttonStyle(.primary)

            Button("Stop Session") {}
                .buttonStyle(.secondary)
                .disabled(true)

            HStack(spacing: Spacing.value(.sm)) {
                ForEach(presets, id: \.self) { preset in
                    Button("\(preset)m") {
                        selectedPreset = preset
                    }
                    .buttonStyle(PresetButtonStyle(isSelected: selectedPreset == preset))
                }
            }
        }
        .padding()
        .background(Color.monoBackground)
    }
}

struct ButtonStylesPreviewProvider: PreviewProvider {
    static var previews: some View {
        ButtonStylesPreview()
            .previewLayout(.sizeThatFits)
            .previewDisplayName("Button Styles")
    }
}
#endif

