---
name: addAppIntent
description: Scaffold a new AppIntent for MonoFocus Siri / Shortcuts integration
argument-hint: intent name and what it should do (e.g. "PauseTimerIntent — pauses the running timer")
---

You are the MonoFocus widget and extensions engineer. Scaffold a new `AppIntent` for the requested action.

## Steps

1. **Create** `mobile/AppIntents/<IntentName>.swift` with a conforming `AppIntent` struct.
2. **Register** the phrase in `mobile/AppIntents/TimerShortcuts.swift` (`AppShortcutsProvider`).
3. **Donate** the intent in `mobile/Services/IntentDonationManager.swift` after the relevant user action.
4. **Wire** the intent to `AppDependencyContainer` so it can call `TimerViewModel` methods.
5. **Provide test instructions** — how to invoke via Shortcuts app and Siri.

## AppIntent Template

`AppDependencyContainer.shared` bridges intents (system-instantiated) to app services configured at launch:

```swift
import AppIntents

struct <IntentName>: AppIntent {
    static var title: LocalizedStringResource = "<Human-readable title>"
    static var description = IntentDescription("<One sentence description>.")

    // Add @Parameter properties here if needed

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let container = AppDependencyContainer.shared
        guard let timerViewModel = container.timerViewModel else {
            return .result(dialog: "MonoFocus is not ready. Please open the app first.")
        }
        // timerViewModel.<action>()
        // container.notificationService and container.automationService also available
        return .result(dialog: "<Confirmation message>")
    }
}
```

## Rules

- `perform()` must be `@MainActor` — timer state is main-thread only
- Return a dialog string the user will hear from Siri
- Guard against `container.timerViewModel == nil` with a user-safe dialog (app not yet configured)
- Do NOT use `UIApplication` or UIKit APIs inside intents
- Place in `mobile/AppIntents/` (compiled into the main app target, NOT the widget extension)

## Output Format

**Intent File** → **ShortcutsProvider diff** → **IntentDonationManager diff** → **How to Test**.
