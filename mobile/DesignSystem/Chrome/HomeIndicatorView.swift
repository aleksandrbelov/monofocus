import SwiftUI

/// Mimics the iOS home indicator bar at the bottom of the screen.
struct HomeIndicatorView: View {
    private let width: CGFloat = 134
    private let height: CGFloat = 5
    private let bottomPadding: CGFloat = 8

    var body: some View {
        Rectangle()
            .fill(Color.monoForeground.opacity(0.36))
            .frame(width: width, height: height)
            .clipShape(Capsule())
            .padding(.bottom, bottomPadding)
            .frame(maxWidth: .infinity)
            .accessibilityHidden(true)
    }
}

#if DEBUG
struct HomeIndicatorView_Previews: PreviewProvider {
    static var previews: some View {
        HomeIndicatorView()
            .background(Color.monoBackground)
            .previewLayout(.sizeThatFits)
            .padding()
    }
}
#endif

