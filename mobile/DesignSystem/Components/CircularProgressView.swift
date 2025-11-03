import SwiftUI
import UIKit

/// Circular progress indicator designed for the MonoFocus timer.
struct CircularProgressView: View {
    let progress: Double
    let isPaused: Bool

    private let diameter: CGFloat = 280
    private let strokeWidth: CGFloat = 6

    @State private var pulse = false

    var body: some View {
        ZStack {
            Circle()
                .stroke(
                    Color.surface(progress <= 0 ? .surface3 : .surface2),
                    style: StrokeStyle(
                        lineWidth: strokeWidth,
                        lineCap: .round,
                        dash: progress <= 0 ? [8, 8] : []
                    )
                )

            Circle()
                .trim(from: 0, to: CGFloat(clampedProgress))
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [
                            Color.monoForeground,
                            Color.monoForeground.opacity(0.6)
                        ]),
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .opacity(progressOpacity)
                .animation(Animations.respectingReduceMotion(Animations.easeOut), value: progress)
        }
        .frame(width: diameter, height: diameter)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Timer progress")
        .accessibilityValue(progressAccessibilityDescription)
        .onAppear(perform: updatePulse)
        .onChange(of: isPaused) { _ in
            updatePulse()
        }
        .onChange(of: UIAccessibility.isReduceMotionEnabled) { _ in
            updatePulse()
        }
    }

    private var clampedProgress: Double {
        min(max(progress, 0), 1)
    }

    private var progressOpacity: Double {
        guard isPaused, !UIAccessibility.isReduceMotionEnabled else {
            return 1.0
        }
        return pulse ? 0.5 : 1.0
    }

    private var progressAccessibilityDescription: String {
        let percent = Int(clampedProgress * 100)
        return "\(percent) percent remaining"
    }

    private func updatePulse() {
        guard !UIAccessibility.isReduceMotionEnabled else {
            pulse = false
            return
        }

        if isPaused {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                pulse.toggle()
            }
        } else {
            withAnimation(.linear(duration: 0.2)) {
                pulse = false
            }
        }
    }
}

#if DEBUG
struct CircularProgressView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            CircularProgressView(progress: 1.0, isPaused: false)
                .previewDisplayName("Full Progress")

            CircularProgressView(progress: 0.45, isPaused: true)
                .previewDisplayName("Paused Progress")

            CircularProgressView(progress: 0.0, isPaused: false)
                .previewDisplayName("Empty Progress")
        }
        .padding()
        .background(Color.monoBackground)
        .previewLayout(.sizeThatFits)
    }
}
#endif

