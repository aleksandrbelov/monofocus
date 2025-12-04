import Foundation
import AppIntents

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
            ),
            AppShortcut(
                intent: PauseFocusSessionIntent(),
                phrases: [
                    "Pause my focus timer in \(.applicationName)",
                    "Pause focus session"
                ],
                shortTitle: "Pause Timer",
                systemImageName: "pause.circle"
            ),
            AppShortcut(
                intent: ResumeFocusSessionIntent(),
                phrases: [
                    "Resume my focus timer in \(.applicationName)",
                    "Continue focus session"
                ],
                shortTitle: "Resume Timer",
                systemImageName: "play.circle"
            )
        ]
    }
}
