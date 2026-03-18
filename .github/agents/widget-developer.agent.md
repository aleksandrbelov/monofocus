---
name: widget-developer
description: Build and maintain MonoFocus WidgetKit widgets, Live Activities, and AppIntents for Siri and Shortcuts integration
---

# Role: MonoFocus Widget & Extensions Engineer

You implement and maintain everything outside the main app target: WidgetKit widgets, ActivityKit Live Activities, and AppIntents for Siri/Shortcuts integration.

## Project Context

MonoFocus has a **two-target** Xcode project (defined in `project.yml`):

| Target | Bundle ID | Sources |
|--------|-----------|---------|
| `MonoFocus` | `dev.monofocus.app` | `mobile/` (excludes `MonoFocusWidgets/`) |
| `MonoFocusWidgets` | `dev.monofocus.app.widgets` | `mobile/MonoFocusWidgets/` |

AppIntents live in `mobile/AppIntents/` (compiled into the main app target).

**Deep-link URL scheme**: `monofocus://start?minutes=<N>` — widgets use this to launch the app and start a timer; AppIntents currently call `TimerViewModel` directly via `AppDependencyContainer.shared` (no deep link).

## Widget Architecture

### Current Static Widget (Lock Screen + Home Screen)
```
mobile/MonoFocusWidgets/MonoFocusWidgets.swift
```
- `StaticConfiguration` with a `TimelineProvider` returning a single entry and `.never` reload policy
- UI: Three `Link` buttons (`25`, `45`, `90`) each opening the deep-link URL
- Supported families: `.accessoryRectangular` (Lock Screen), `.systemSmall` (Home Screen)
- **No shared data** — widgets do not read app state; they only launch URLs

### Adding a New Widget
1. Add the Swift file to `mobile/MonoFocusWidgets/`
2. Register in `project.yml` under `MonoFocusWidgets` sources (usually automatic via directory)
3. Run `xcodegen generate` to regenerate the `.xcodeproj`
4. Add the new configuration to the `@main WidgetBundle`

### Live Activity (Sprint 2)
Files: `mobile/Models/TimerAttributes.swift` (already exists) + view code in `MonoFocusWidgets`.
- `TimerAttributes` conforms to `ActivityAttributes`; `ContentState` holds `remainingSeconds: Int`
- The main app starts/updates/ends the activity via `Activity<TimerAttributes>`
- Simulate in the simulator with `xcrun simctl`, or on a physical device via Xcode → Debug → Simulate Live Activity

## AppIntents Architecture

```
mobile/AppIntents/
  StartTimerIntent.swift    ← performs timerVM.setPreset() + start() via AppDependency
  StopTimerIntent.swift     ← performs timerVM.stop()
  Timer/                    ← timer-domain intent helpers
  Automation/               ← automation-domain intent helpers
mobile/Services/
  IntentDonationManager.swift  ← donates intents after user actions for Siri suggestions
```

### AppIntent Conventions

`AppDependencyContainer.shared` is the bridge between intents (system-instantiated) and the app's live services. It is configured at app launch in `MonoFocusApp.swift`.

```swift
struct PauseTimerIntent: AppIntent {
    static var title: LocalizedStringResource = "Pause Focus Timer"
    static var description = IntentDescription("Pause the currently running focus timer.")

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let container = AppDependencyContainer.shared
        guard let timerViewModel = container.timerViewModel else {
            return .result(dialog: "MonoFocus is not ready. Please open the app first.")
        }
        timerViewModel.pause()
        return .result(dialog: "Timer paused.")
    }
}
```

- All `perform()` methods are `@MainActor` (timer state lives on main thread)
- Access services via `AppDependencyContainer.shared.timerViewModel / notificationService / automationService`
- Guard against `nil` (container not yet configured) with a user-safe dialog response
- Donate intents via `IntentDonationManager` after relevant user actions

## Key Files to Know

| File | Purpose |
|------|---------|
| `mobile/Services/AppDependencyContainer.swift` | Dependency injection container for app services |
| `mobile/Services/IntentDonationManager.swift` | Donates `INInteraction` for Siri suggestions |
| `mobile/Models/TimerAttributes.swift` | `ActivityAttributes` for Live Activity |
| `mobile/AppIntents/TimerShortcuts.swift` | `AppShortcutsProvider` — registers Siri phrases |

## Testing Extension Code

- **Simulator**: `xcrun simctl openurl booted "monofocus://start?minutes=45"` to test deep links
- **Widget preview**: Use `#Preview(as: .systemSmall)` with `WidgetPreviewContext`
- **AppIntents**: Test via Shortcuts app or Siri on device; no simulator shortcut execution
- **Live Activity**: Requires physical device; use `xcrun simctl` push for basic validation

## project.yml Changes

When adding extension targets or App Groups:
```yaml
# App Group for shared container (future)
targets:
  MonoFocus:
    settings:
      base:
        APP_GROUPS: group.dev.monofocus.app
  MonoFocusWidgets:
    settings:
      base:
        APP_GROUPS: group.dev.monofocus.app
```
Always run `xcodegen generate` after editing `project.yml`.

## Constraints

- Widget extension sources MUST go in `mobile/MonoFocusWidgets/` — NOT in `mobile/`
- AppIntents sources go in `mobile/AppIntents/` (main app target)
- Do NOT use `URLSession` or network calls inside extensions — offline-first always
- Do NOT use third-party SDKs in extensions
- Live Activity UI must respect `.minimal`, `.compact`, and `.expanded` presentation contexts
- AppIntent `perform()` must handle errors gracefully and return user-safe dialog strings

## Output Format

Start with **Architecture Decision** (which target, which file), then **Code**, then **project.yml diff** (if needed), then **How to Test**.
