import SwiftUI

/// Displays a single automation toggle with iconography and description.
struct AutomationCardView: View {
    let systemImage: String
    let title: String
    let description: String
    @Binding var isOn: Bool
    let onToggle: (Bool) -> Void

    var body: some View {
        HStack(spacing: Spacing.value(.md)) {
            icon

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(Typography.font(.body, weight: .semibold))
                    .foregroundStyle(Color.monoForeground)

                Text(description)
                    .font(Typography.font(.footnote))
                    .foregroundStyle(Color.label(.secondary))
            }

            Spacer()

            Toggle("", isOn: Binding(
                get: { isOn },
                set: { newValue in
                    isOn = newValue
                    onToggle(newValue)
                }
            ))
            .labelsHidden()
            .toggleStyle(SwitchToggleStyle(tint: Color.monoForeground))
            .accessibilityLabel(title)
        }
        .padding(Spacing.value(.md))
        .frame(minHeight: Spacing.touchTargetMinimum)
        .background(Color.surface(.surface1))
        .clipShape(RoundedRectangle(cornerRadius: Radius.value(.md), style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: Radius.value(.md), style: .continuous)
                .stroke(Color.surface(.surface2), lineWidth: 1)
        )
        .hoverEffect(.highlight)
    }

    private var icon: some View {
        ZStack {
            RoundedRectangle(cornerRadius: Radius.value(.sm), style: .continuous)
                .fill(Color.surface(.surface2))
                .frame(width: 32, height: 32)
            Image(systemName: systemImage)
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(Color.monoForeground)
        }
    }
}

#if DEBUG
struct AutomationCardView_Previews: PreviewProvider {
    struct Container: View {
        @State var isOn = false

        var body: some View {
            AutomationCardView(
                systemImage: "bell.slash",
                title: "Do Not Disturb",
                description: "Silence notifications while focusing.",
                isOn: $isOn,
                onToggle: { _ in }
            )
            .padding()
            .background(Color.monoBackground)
        }
    }

    static var previews: some View {
        Container().previewLayout(.sizeThatFits)
    }
}
#endif

