import WidgetKit
import SwiftUI
import Foundation

// MARK: - Extensions

extension View {
    @ViewBuilder
    func widgetBackground(_ color: Color) -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            self.containerBackground(color, for: .widget)
        } else {
            ZStack {
                ContainerRelativeShape()
                    .fill(color)
                self
            }
        }
    }
}

// MARK: - Persistence (Inlined for Widget Target Access)

/// Read-only access to App Group data for Widgets.
/// Copied logic from SharedDataManager to insure access within Widget Target
struct WidgetPersistence {
    static let appGroupId = "group.dev.monofocus.data"
    
    private static var fileContainerURL: URL? {
        FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupId)
    }
    
    static var stateURL: URL? {
        fileContainerURL?.appendingPathComponent("timer-state.json")
    }
    
    /// Reads the raw timer state dictionary directly (lightweight for Widgets).
    static func loadRawTimerState() -> [String: Any]? {
        guard let url = stateURL else {
            print("[WidgetPersistence] App Group URL unavailable")
            return nil
        }
        
        do {
            let data = try Data(contentsOf: url)
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                print("[WidgetPersistence] Failed to decode JSON")
                return nil
            }
            return json
        } catch {
            print("[WidgetPersistence] Failed to read state from \(url.path): \(error.localizedDescription)")
            return nil
        }
    }
}

struct WidgetDataManager {
    struct TimerState {
        let totalSeconds: Int
        let remainingSeconds: Int
        let isRunning: Bool
        let isPaused: Bool
        let lastPreset: Int?
        let endDate: Date?
        let sessionStartDate: Date?
    }
    
    static func fetchState() -> TimerState {
        // Must match TimerViewModel defaults
        let defaultState = TimerState(
            totalSeconds: 1500,
            remainingSeconds: 1500,
            isRunning: false,
            isPaused: false,
            lastPreset: 25,
            endDate: nil,
            sessionStartDate: nil
        )
        
        guard let json = WidgetPersistence.loadRawTimerState() else {
            return defaultState
        }
        
        // Calculate dynamic remaining time if running
        var currentRemaining = json["remaining"] as? Int ?? defaultState.remainingSeconds
        let running = json["running"] as? Bool ?? false
        var endDate: Date? = nil
        
        if let endInterval = json["endDate"] as? Double {
            endDate = Date(timeIntervalSince1970: endInterval)
            if running, let target = endDate {
                let diff = target.timeIntervalSinceNow
                currentRemaining = max(0, Int(ceil(diff)))
            }
        }
        
        return TimerState(
            totalSeconds: json["total"] as? Int ?? defaultState.totalSeconds,
            remainingSeconds: currentRemaining,
            isRunning: running,
            isPaused: json["paused"] as? Bool ?? false,
            lastPreset: json["lastPreset"] as? Int ?? defaultState.lastPreset,
            endDate: endDate,
            sessionStartDate: (json["sessionStart"] as? Double).map { Date(timeIntervalSince1970: $0) }
        )
    }
}

// MARK: - Components

struct PresetButton: View {
    let minutes: Int
    let color: Color
    
    var body: some View {
        HStack {
            Text("\(minutes)")
                .font(.system(size: 16, weight: .semibold, design: .rounded))
            Text("min")
                .font(.system(size: 14, weight: .medium, design: .rounded))
                .opacity(0.8)
            Spacer()
            Image(systemName: "play.fill")
                .font(.system(size: 10))
                .opacity(0.6)
        }
        .foregroundColor(color)
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(color.opacity(0.12))
        )
    }
}

struct CircularProgressView: View {
    let progress: Double
    let color: Color
    var w: CGFloat = 90
    var h: CGFloat = 90
    
    var body: some View {
        ZStack {
            Circle()
                .stroke(color.opacity(0.2), lineWidth: 8)
                .frame(width: w, height: h)
            
            Circle()
                .trim(from: 0, to: progress)
                .stroke(color, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .frame(width: w, height: h)
        }
    }
}

struct StatColumn: View {
    let label: String
    let value: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label.uppercased())
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(.secondary)
            Text(value)
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.primary)
        }
    }
}

struct WidgetCommon {
    static let appURL = URL(string: "monofocus://open")!
    
    static func startURL(minutes: Int) -> URL {
        URL(string: "monofocus://start?minutes=\(minutes)")!
    }
}

// MARK: - Small Widget

struct SmallWidgetView: View {
    let entry: WidgetEntry
    
    var body: some View {
        if entry.isRunning || entry.isPaused {
            activeView
        } else {
            idleView
        }
    }
    
    var activeView: some View {
        VStack(spacing: 8) {
            ZStack {
                CircularProgressView(
                    progress: entry.progress,
                    color: entry.isPaused ? .orange : .blue
                )
                
                VStack(spacing: 0) {
                    if let endDate = entry.endDate, entry.isRunning, !entry.isPaused {
                        Text(timerInterval: Date()...endDate, countsDown: true)
                            .multilineTextAlignment(.center)
                            .frame(width: 60)
                            .font(.system(size: 16, weight: .bold, design: .rounded))
                            .monospacedDigit()
                    } else {
                        Text(entry.formattedTime)
                            .font(.system(size: 24, weight: .bold, design: .rounded))
                            .monospacedDigit()
                    }
                    
                    Text(entry.isPaused ? "PAUSED" : "FOCUS")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.secondary)
                        .padding(.top, 2)
                }
            }
            .padding(4)
        }
        .padding()
        .widgetBackground(Color(UIColor.systemBackground))
        .widgetURL(WidgetCommon.appURL)
    }
    
    var idleView: some View {
        VStack {
            Text("Start Focus")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.bottom, 4)
            
            Link(destination: WidgetCommon.startURL(minutes: 25)) {
                PresetButton(minutes: 25, color: .blue)
            }
            .accessibilityLabel("Start 25-minute focus session")
            
            Link(destination: WidgetCommon.startURL(minutes: 45)) {
                PresetButton(minutes: 45, color: .indigo)
            }
            .accessibilityLabel("Start 45-minute focus session")
        }
        .padding()
        .widgetBackground(Color(UIColor.systemBackground))
    }
}

// MARK: - Medium Widget

struct MediumWidgetView: View {
    let entry: WidgetEntry
    
    var body: some View {
        HStack(spacing: 16) {
            // Left Panel: Status or Presets
            if entry.isRunning || entry.isPaused {
                activeStatusPanel
            } else {
                idleStatusPanel
            }
            
            // Right Panel: Quick Actions
            VStack(spacing: 8) {
                Link(destination: WidgetCommon.startURL(minutes: 25)) {
                    PresetButton(minutes: 25, color: .blue)
                }
                .accessibilityLabel("Start 25-minute focus session")
                Link(destination: WidgetCommon.startURL(minutes: 45)) {
                    PresetButton(minutes: 45, color: .indigo)
                }
                .accessibilityLabel("Start 45-minute focus session")
            }
            .frame(width: 110)
        }
        .padding()
        .widgetBackground(Color(UIColor.systemBackground))
    }
    
    var activeStatusPanel: some View {
        VStack(alignment: .leading) {
            HStack {
                Circle()
                    .fill(entry.isPaused ? Color.orange : Color.blue)
                    .frame(width: 8, height: 8)
                Text(entry.isPaused ? "PAUSED" : "ACTIVE")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Spacer()
            
            if let endDate = entry.endDate, entry.isRunning, !entry.isPaused {
                Text(timerInterval: Date()...endDate, countsDown: true)
                    .font(.system(size: 42, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .minimumScaleFactor(0.8)
            } else {
                Text(entry.formattedTime)
                    .font(.system(size: 42, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .minimumScaleFactor(0.8)
            }
            
            Text("Focus Session")
                .multilineTextAlignment(.center)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .widgetURL(WidgetCommon.appURL)
    }
    
    var idleStatusPanel: some View {
        VStack(alignment: .leading) {
            Text("Ready to Focus?")
                .font(.headline)
                .foregroundColor(.primary)
            
            Spacer()
            
            Text("Stay productive with a new session.")
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - Large Widget

struct LargeWidgetView: View {
    let entry: WidgetEntry
    
    var body: some View {
        VStack(spacing: 20) {
            // Top Section: Status
            if entry.isRunning || entry.isPaused {
                activeStatusHeader
            } else {
                idleStatusHeader
            }
            
            Divider()
            
            // Middle Section: Stats (Removed placeholder data)
            // Stats will be re-enabled when real data fetching is implemented
            Spacer()
            
            Spacer()
            
            // Bottom Section: Quick Presets
            VStack(spacing: 8) {
                Text("Quick Start")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                HStack(spacing: 12) {
                    Link(destination: WidgetCommon.startURL(minutes: 25)) {
                        PresetButton(minutes: 25, color: .blue)
                    }
                    .accessibilityLabel("Start 25-minute focus session")
                    Link(destination: WidgetCommon.startURL(minutes: 50)) {
                        PresetButton(minutes: 10, color: .purple)
                    }
                    .accessibilityLabel("Start 50-minute focus session")
                }
            }
        }
        .padding()
        .widgetBackground(Color(UIColor.systemBackground))
    }
    
    var activeStatusHeader: some View {
        VStack(spacing: 4) {
            if let endDate = entry.endDate, entry.isRunning, !entry.isPaused {
                Text(timerInterval: Date()...endDate, countsDown: true)
                    .multilineTextAlignment(.center)
                    .font(.system(size: 64, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .minimumScaleFactor(0.8)
                    .foregroundColor(entry.isPaused ? .orange : .primary)
            } else {
                Text(entry.formattedTime)
                    .font(.system(size: 64, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .minimumScaleFactor(0.8)
                    .foregroundColor(entry.isPaused ? .orange : .primary)
            }
            
            HStack {
                if entry.isPaused {
                    Image(systemName: "pause.fill")
                        .foregroundColor(.orange)
                    Text("Session Paused")
                        .foregroundColor(.orange)
                } else {
//                    Image(systemName: "timer")
//                        .foregroundColor(.blue)
                    ZStack {
                        CircularProgressView(
                            progress: entry.progress,
                            color: entry.isPaused ? .orange : .blue,
                            w: 20,
                            h: 20
                        )
//                        Circle()
//                            .stroke(Color.blue.opacity(0.2), lineWidth: 8)
//                            .fill(Color.white)
//                            .frame(width: 12, height: 12)
                        Circle()
                            .fill(entry.isPaused ? Color.orange : Color.blue)
                            .frame(width: 6, height: 6)
                    }
                    Text("Focusing...")
                        .foregroundColor(.secondary)
                }
            }
            .font(.subheadline.weight(.medium))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .widgetURL(WidgetCommon.appURL)
    }
    
    var idleStatusHeader: some View {
        VStack(spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 40))
                .foregroundColor(.green)
                .padding(.bottom, 4)
            
            Text("All Caught Up")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("Start a new session to keep your streak going.")
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
    }
}

// MARK: - Widget Entry Point

struct WidgetEntry: TimelineEntry {
    let date: Date
    let totalSeconds: Int
    let remainingSeconds: Int
    let isRunning: Bool
    let isPaused: Bool
    let endDate: Date?
    
    var progress: Double {
        guard totalSeconds > 0 else { return 0 }
        let p = Double(totalSeconds - remainingSeconds) / Double(totalSeconds)
        return min(max(p, 0), 1)
    }
    
    var formattedTime: String {
        let m = remainingSeconds / 60
        let s = remainingSeconds % 60
        return String(format: "%02d:%02d", m, s)
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> WidgetEntry {
        WidgetEntry(
            date: Date(),
            totalSeconds: 1500,
            remainingSeconds: 1500,
            isRunning: false,
            isPaused: false,
            endDate: nil
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (WidgetEntry) -> Void) {
        let state = WidgetDataManager.fetchState()
        let entry = WidgetEntry(
            date: Date(),
            totalSeconds: state.totalSeconds,
            remainingSeconds: state.remainingSeconds,
            isRunning: state.isRunning,
            isPaused: state.isPaused,
            endDate: state.endDate
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WidgetEntry>) -> Void) {
        let state = WidgetDataManager.fetchState()
        let currentDate = Date()
        
        var entries: [WidgetEntry] = []
        
        if state.isRunning && !state.isPaused {
            // Simplified Timeline Strategy:
            // Just return one entry now. The system will update when we call reloadTimelines from the App.
            let entry = WidgetEntry(
                date: currentDate,
                totalSeconds: state.totalSeconds,
                remainingSeconds: state.remainingSeconds,
                isRunning: state.isRunning,
                isPaused: state.isPaused,
                endDate: state.endDate
            )
            entries.append(entry)
            
            // Refresh policy: at end
            // Refresh policy:
            // If we have an end date, refresh then. Otherwise default to 1 minute to keep UI somewhat fresh if unexpected.
            // Using a policy of .atEnd is usually best for timers, but .after(date) gives us control if logic fails.
            let reloadDate: Date
            if let endDate = state.endDate, endDate > currentDate {
                reloadDate = endDate
            } else {
                reloadDate = Calendar.current.date(byAdding: .minute, value: 1, to: currentDate) ?? currentDate.addingTimeInterval(60)
            }
            completion(Timeline(entries: entries, policy: .after(reloadDate)))
            
        } else {
            // Idle or Paused - Static
            let entry = WidgetEntry(
                date: currentDate,
                totalSeconds: state.totalSeconds,
                remainingSeconds: state.remainingSeconds,
                isRunning: state.isRunning,
                isPaused: state.isPaused,
                endDate: state.endDate
            )
            completion(Timeline(entries: [entry], policy: .never))
        }
    }
}

@main
struct MonoFocusWidgetsBundle: WidgetBundle {
    var body: some Widget {
        MonoFocusWidgets()
#if canImport(ActivityKit)
        if #available(iOSApplicationExtension 16.1, *) {
            TimerLiveActivityWidget()
        }
#endif
    }
}

struct MonoFocusWidgets: Widget {
    let kind: String = "MonoFocusWidgets"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MonoFocusWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("MonoFocus")
        .description("Track your focus sessions and start new ones.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct MonoFocusWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

// MARK: - Previews

@available(iOS 17.0, *)
#Preview("Small - Idle", as: .systemSmall) {
    MonoFocusWidgets()
} timeline: {
    WidgetEntry(
        date: Date(),
        totalSeconds: 1500,
        remainingSeconds: 1500,
        isRunning: false,
        isPaused: false,
        endDate: nil
    )
}

@available(iOS 17.0, *)
#Preview("Small - Running", as: .systemSmall) {
    MonoFocusWidgets()
} timeline: {
    WidgetEntry(
        date: Date(),
        totalSeconds: 1500,
        remainingSeconds: 1200, // 20 mins left
        isRunning: true,
        isPaused: false,
        endDate: Date().addingTimeInterval(1200)
    )
}

@available(iOS 17.0, *)
#Preview("Medium - Running", as: .systemMedium) {
    MonoFocusWidgets()
} timeline: {
    WidgetEntry(
        date: Date(),
        totalSeconds: 1500,
        remainingSeconds: 1200,
        isRunning: true,
        isPaused: false,
        endDate: Date().addingTimeInterval(1200)
    )
}

@available(iOS 17.0, *)
#Preview("Large - Idle", as: .systemLarge) {
    MonoFocusWidgets()
} timeline: {
    WidgetEntry(
        date: Date(),
        totalSeconds: 1500,
        remainingSeconds: 1500,
        isRunning: false,
        isPaused: false,
        endDate: nil
    )
}

@available(iOS 17.0, *)
#Preview("Large - Running", as: .systemLarge) {
    MonoFocusWidgets()
} timeline: {
    WidgetEntry(
        date: Date(),
        totalSeconds: 1500,
        remainingSeconds: 600, // 10 mins left
        isRunning: true,
        isPaused: false,
        endDate: Date().addingTimeInterval(600)
    )
}

