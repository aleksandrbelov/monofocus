#if canImport(ActivityKit)
import Foundation
import ActivityKit

@available(iOS 16.1, *)
struct TimerAttributes: ActivityAttributes {
    static var activityType: String { "dev.monofocus.app.timer" }

    public struct ContentState: Codable, Hashable {
        var remainingSeconds: Int
        var isPaused: Bool
        var endDate: Date
    }

    var totalSeconds: Int
    var presetLabel: String?
    var sessionType: String?
    var isAutomation: Bool = false
}
#endif
