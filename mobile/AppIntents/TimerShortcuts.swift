import Foundation
import AppIntents

@available(iOS 16.0, *)
struct TimerShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        return [
            AppShortcut(
                intent: StartTimerIntent(),
                phrases: [
                    "Start a focus timer in \(.applicationName)",
                    "Begin a focus session",
                    "Start my focus timer"
                ],
                shortTitle: "Start Timer",
                systemImageName: "timer"
            ),
            AppShortcut(
                intent: StopTimerIntent(),
                phrases: [
                    "Stop my focus timer in \(.applicationName)",
                    "End current focus session"
                ],
                shortTitle: "Stop Timer",
                systemImageName: "stop.circle"
            )
        ]
    }
}
