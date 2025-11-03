import SwiftUI
import UIKit
import Combine

/// Simulated iOS status bar with live clock and battery indicators.
struct StatusBarView: View {
    @State private var batteryLevel: Float = UIDevice.current.batteryLevel
    @State private var batteryState: UIDevice.BatteryState = UIDevice.current.batteryState
    @State private var safeAreaTop: CGFloat = 0

    private static let timeFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.locale = Locale.autoupdatingCurrent
        formatter.setLocalizedDateFormatFromTemplate("j:mm")
        return formatter
    }()

    var body: some View {
        GeometryReader { proxy in
            TimelineView(.periodic(from: .now, by: 1)) { context in
                content(date: context.date)
            }
            .frame(height: Spacing.statusBarHeight)
            .padding(.top, proxy.safeAreaInsets.top)
            .padding(.horizontal, Spacing.value(.xl))
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .background(Color.monoBackground.opacity(0.001))
            .onAppear {
                updateSafeAreaTop(proxy.safeAreaInsets.top)
            }
            .onChange(of: proxy.safeAreaInsets.top) { newValue in
                updateSafeAreaTop(newValue)
            }
        }
        .frame(height: Spacing.statusBarHeight + safeAreaTop)
        .onAppear {
            UIDevice.current.isBatteryMonitoringEnabled = true
            batteryLevel = UIDevice.current.batteryLevel
            batteryState = UIDevice.current.batteryState
        }
        .onReceive(NotificationCenter.default.publisher(for: UIDevice.batteryLevelDidChangeNotification)) { _ in
            withAnimation(Animations.respectingReduceMotion(Animations.easeOut)) {
                batteryLevel = UIDevice.current.batteryLevel
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: UIDevice.batteryStateDidChangeNotification)) { _ in
            batteryState = UIDevice.current.batteryState
        }
        .onDisappear {
            UIDevice.current.isBatteryMonitoringEnabled = false
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Status bar")
        .accessibilityValue(statusAccessibilityValue)
    }

    private func content(date: Date) -> some View {
        let formattedTime = Self.timeFormatter.string(from: date)

        return HStack {
            Text(formattedTime)
                .font(Typography.font(.subheadline, weight: .semibold))
                .foregroundStyle(Color.monoForeground)

            Spacer()

            HStack(spacing: Spacing.value(.xs)) {
                BatteryIndicatorView(
                    level: CGFloat(min(max(batteryLevel, 0), 1)),
                    state: batteryState
                )
                if batteryState == .charging {
                    Image(systemName: "bolt.fill")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(Color.monoForeground)
                }
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("Battery")
            .accessibilityValue(batteryAccessibilityValue)
        }
    }

    private var statusAccessibilityValue: String {
        let timeString = Self.timeFormatter.string(from: Date())
        return "\(timeString). \(batteryAccessibilityValue)"
    }

    private var batteryAccessibilityValue: String {
        guard batteryLevel >= 0 else { return "Battery level unavailable" }
        let normalized = max(min(batteryLevel, 1), 0)
        let percentage = Int(normalized * 100)
        switch batteryState {
        case .charging:
            return "Battery at \(percentage) percent and charging"
        case .full:
            return "Battery full"
        default:
            return "Battery at \(percentage) percent"
        }
    }

    private func updateSafeAreaTop(_ inset: CGFloat) {
        if safeAreaTop != inset {
            safeAreaTop = inset
        }
    }
}

private struct BatteryIndicatorView: View {
    let level: CGFloat
    let state: UIDevice.BatteryState

    private let width: CGFloat = 27
    private let height: CGFloat = 13
    private let cornerRadius: CGFloat = 3
    private let earWidth: CGFloat = 2.5

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                .strokeBorder(Color.monoForeground, lineWidth: 1)
                .frame(width: width, height: height)

            RoundedRectangle(cornerRadius: cornerRadius - 1, style: .continuous)
                .fill(batteryFillColor)
                .frame(width: max((width - earWidth - 3) * clampedLevel, 2), height: height - 4)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.leading, 1.5)

            RoundedRectangle(cornerRadius: cornerRadius / 2, style: .continuous)
                .fill(Color.monoForeground)
                .frame(width: earWidth, height: height / 2)
                .offset(x: width / 2 + earWidth / 2 - 0.5)
        }
        .frame(width: width + earWidth, height: height)
    }

    private var batteryFillColor: Color {
        if clampedLevel <= 0.2 && state != .charging {
            return Color.red.opacity(0.8)
        }
        return Color.monoForeground
    }

    private var clampedLevel: CGFloat {
        min(max(level, 0), 1)
    }
}

#if DEBUG
struct StatusBarView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            StatusBarView()
                .previewDisplayName("Status Bar – Light")
                .preferredColorScheme(.light)

            StatusBarView()
                .previewDisplayName("Status Bar – Dark")
                .preferredColorScheme(.dark)
        }
        .previewLayout(.sizeThatFits)
        .background(Color.monoBackground)
    }
}
#endif
