import SwiftUI

/// Top-level header containing brand title, tagline, and chromed controls.
struct HeaderView: View {
    let onInfo: () -> Void

    var body: some View {
        HStack(spacing: Spacing.value(.md)) {
            VStack(alignment: .leading, spacing: Spacing.value(.xs)) {
                Text("MonoFocus")
                    .font(Typography.font(.largeTitle, weight: .bold))
                    .foregroundStyle(Color.monoForeground)

                Text("Stay present. Protect your flow.")
                    .font(Typography.font(.callout))
                    .foregroundStyle(Color.label(.tertiary))
            }

            Spacer()

            ThemeToggle()

            Button {
                Haptics.selection()
                onInfo()
            } label: {
                Image(systemName: "questionmark.circle")
                    .font(.system(size: 20, weight: .semibold))
                    .frame(width: 44, height: 44)
                    .background(Color.surface(.surface2))
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Open setup instructions")
        }
    }
}

#if DEBUG
struct HeaderView_Previews: PreviewProvider {
    static var previews: some View {
        HeaderView(onInfo: {})
            .environmentObject(ThemeManager())
            .padding()
            .background(Color.monoBackground)
            .previewLayout(.sizeThatFits)
    }
}
#endif

