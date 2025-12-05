import Foundation
import AppIntents

struct TimerShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        return [
            AppShortcut(
                intent: StartTimerIntent(),
                phrases: [
                    "Start a focus timer in \(.applicationName)",
                    "Begin a focus session in \(.applicationName)",
                    "Start my focus timer in \(.applicationName)"
                ],
                shortTitle: "Start Timer",
                systemImageName: "timer"
            ),
            AppShortcut(
                intent: StopTimerIntent(),
                phrases: [
                    "Stop my focus timer in \(.applicationName)",
                    "End current focus session in \(.applicationName)"
                ],
                shortTitle: "Stop Timer",
                systemImageName: "stop.circle"
            ),
            AppShortcut(
                intent: PauseFocusSessionIntent(),
                phrases: [
                    "Pause my focus timer in \(.applicationName)",
                    "Pause focus session in \(.applicationName)"
                ],
                shortTitle: "Pause Timer",
                systemImageName: "pause.circle"
            ),
            AppShortcut(
                intent: ResumeFocusSessionIntent(),
                phrases: [
                    "Resume my focus timer in \(.applicationName)",
                    "Continue focus session in \(.applicationName)"
                ],
                shortTitle: "Resume Timer",
                systemImageName: "play.circle"
            )
        ]
    }
}
