# MonoFocus AI Coding Instructions

## Project Overview
MonoFocus is a minimal, offline-first iOS focus timer app built with SwiftUI and WidgetKit. No analytics, no network—everything runs on-device with local JSON persistence. Design philosophy: friction-free single-screen experience with optional iOS Shortcuts integration for DND/grayscale automation.

## Architecture & Data Flow

### MVVM State Management
- **`TimerViewModel`** (single source of truth):
  - State: `totalSeconds`, `remainingSeconds`, `isRunning`, `isPaused`, `lastPreset`
  - Persistence: Auto-saves state to `Documents/timer-state.json` on background
  - Timer mechanism: Combine `Timer.publish()` with 1-second intervals
  - Session history: Appends `FocusSession` to `Documents/sessions.json` on completion

- **`NotificationService`** (@MainActor):
  - Permission flow: Request once in `MonoFocusApp.task` via `requestAuthorizationIfNeeded()`
  - Scheduling: `scheduleEndOfSessionNotification(inSeconds:)` with identifier `"end-of-session"`
  - Cleanup: Removes pending notifications on pause/stop to prevent stale alerts

- **`ShortcutService`** (@MainActor):
  - Stores user-created Shortcut names in `UserDefaults` (`dndShortcutName`, `grayscaleShortcutName`)
  - Launches via `shortcuts://run-shortcut?name=<encoded>` URL scheme (user-initiated, may break in future iOS)
  - No validation—gracefully fails if shortcut doesn't exist

### Deep Linking Flow
1. Widget/external app opens `monofocus://start?minutes=25`
2. `MonoFocusApp.onOpenURL` captures URL
3. `URLRouter.handle()` parses query params, calls `timerVM.setPreset()` + `start()`
4. Widget uses `Link` destination (no timeline updates needed)

### Data Persistence Strategy
- **Sessions**: JSON array of `FocusSession` (id: UUID, start: Date, durationSeconds: Int, presetLabel: String?, completed: Bool)
- **State**: JSON dictionary with `total`, `remaining`, `running`, `paused` keys
- **Restoration**: `restoreState()` runs in `TimerViewModel.init()`, resets `isRunning/isPaused` to false (no background timer continuity in MVP)

## Critical Workflows

### Initial Project Setup
```bash
brew install xcodegen
cd MonoFocus
xcodegen generate  # Creates .xcodeproj from project.yml
open MonoFocus.xcodeproj
```
**Always** run `xcodegen generate` after modifying `project.yml` (targets, sources, bundle IDs, settings).

### Build & Run
- Target: iOS 16.0+, Swift 5.9, requires Xcode 15+
- Run on device/simulator: Cmd+R in Xcode
- Widget extension auto-builds with main app (defined in `project.yml` dependencies)

### Testing Widgets
1. Run app on device/simulator
2. iOS Settings → Lock Screen → Customize → Add Widget → MonoFocus Presets
3. Tap "25" button in widget → should launch app with timer started at 25 minutes
4. Simulator testing: `xcrun simctl openurl booted "monofocus://start?minutes=45"`

### Testing Shortcuts Integration
1. Create Shortcuts in iOS Shortcuts app (e.g., "MonoFocus DND")
2. Enter exact name in app's Automation section
3. Tap "Run" button → should open Shortcuts app and execute
4. If shortcut missing, `UIApplication.shared.open()` fails silently (intended behavior)

### Theme Development Workflow
Design tokens in `design/figma-tokens.json`:
```json
{
  "spacing": { "xl": 32, "l": 20, "m": 12 }
}
```
After editing tokens:
```bash
swift mobile/Utils/generateTheme.swift  # Regenerates Theme.swift
```
This script reads JSON and writes Swift constants to `mobile/Utils/Theme.swift`. Add new token categories (colors, fonts) by updating both files.

### Debugging State Issues
- Check persisted state: `cat ~/Library/Developer/CoreSimulator/Devices/<UUID>/data/Containers/Data/Application/<UUID>/Documents/timer-state.json`
- Check sessions: `cat .../Documents/sessions.json`
- Reset state: Delete files in simulator's Documents directory or uninstall app

## Code Conventions

### Timer State Machine (STRICT)
`TimerViewModel` enforces a finite state machine—**never** mutate `isRunning`/`isPaused` outside these methods:

1. **`setPreset(minutes:)`** → Only when `!isRunning`, sets `totalSeconds` and `remainingSeconds`
2. **`start(notificationService:)`** → Transitions to running state:
   - Sets `isRunning = true`, `isPaused = false`
   - Calls `scheduleTick()` (Combine timer with 1-second interval)
   - Calls `scheduleEndNotification()` (async, schedules local notification)
   - Triggers `Haptics.success()` (heavy impact)
3. **`pause()`** → Transitions to paused state:
   - Sets `isPaused = true`, `isRunning = false`
   - Cancels `tickCancellable` (stops countdown)
   - Removes pending notifications
   - Triggers `Haptics.soft()`
4. **`resume(notificationService:)`** → Re-enters running state:
   - Guards `!isRunning && isPaused`
   - Resets `isRunning = true`, `isPaused = false`
   - Reschedules tick and notification with remaining time
5. **`stop(save:)`** → Resets to initial state:
   - Sets both `isRunning` and `isPaused` to false
   - Cancels tick, removes notifications
   - Optionally persists session to `sessions.json` if `save = true`
   - Resets `remainingSeconds = totalSeconds`

**Why this matters**: SwiftUI re-renders depend on `@Published` state changes. Direct mutation causes race conditions with Combine timers.

### Haptics Pattern (Consistency)
All haptics go through `Haptics` enum at bottom of `TimerViewModel.swift`:
- **`Haptics.success()`** → `UIImpactFeedbackGenerator(style: .heavy)` → Session starts/resumes
- **`Haptics.soft()`** → `UIImpactFeedbackGenerator(style: .soft)` → Pause/stop actions
- **`Haptics.finish()`** → `UINotificationFeedbackGenerator().notificationOccurred(.success)` → Timer completes (countdown reaches 0)

Never call feedback generators directly—use enum for consistency and easy future customization.

### Notification Lifecycle
1. **Permission request** (once, async):
   ```swift
   // In MonoFocusApp.swift body
   .task {
       await notificationService.requestAuthorizationIfNeeded()
   }
   ```
   - Checks `UNAuthorizationStatus`, requests if `.notDetermined`
   - Updates `@Published var permissionGranted` for UI bindings

2. **Scheduling** (on start/resume):
   ```swift
   notificationService.scheduleEndOfSessionNotification(inSeconds: remainingSeconds)
   ```
   - Always uses identifier `"end-of-session"` (allows single-notification replacement)
   - Trigger: `UNTimeIntervalNotificationTrigger` with `max(1, inSeconds)` (minimum 1 second)

3. **Cleanup** (on pause/stop):
   ```swift
   UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["end-of-session"])
   ```
   - Prevents stale notifications if user pauses or stops early

### Background State Handling
`MonoFocusApp.swift` listens to scene phase changes:
```swift
.onChange(of: scenePhase) { _, newPhase in
    if newPhase == .background {
        timerVM.persistState()  // Saves current state to JSON
    }
}
```
**Known limitation**: Timer doesn't continue in background (MVP constraint). On restore, `isRunning` resets to `false`.

### Widget Integration Pattern
Widgets in MonoFocus are **static-only** (no timeline updates):
- `StaticConfiguration` with `TimelineProvider` returning single entry with `.never` policy
- UI uses `Link` buttons: `Link("25", destination: URL(string: "monofocus://start?minutes=25")!)`
- No shared `AppGroup` needed—widgets just launch deep link URLs
- Supported families: `.accessoryRectangular` (Lock Screen), `.systemSmall` (Home Screen)

**Why static?** MVP avoids background refresh complexity. Future: Could add timeline updates showing last session time.

### Button Styles (Consistent UI)
Three custom `ButtonStyle` structs in `TimerView.swift`:
- **`Pill`**: Medium weight, capsule shape, `.thinMaterial` background → Preset buttons, secondary actions
- **`Primary`**: Semibold title3, filled background with 10% primary opacity → Start/Resume
- **`Secondary`**: Medium weight, stroked border (20% opacity), no fill → Pause/Stop

Apply via `.buttonStyle(Primary())` modifier. All use `.scaleEffect()` for press feedback (0.98 scale).

### Accessibility Implementation
- **Dynamic Type**: Timer display uses `.monospacedDigit()` to prevent layout shifts during countdown
- **VoiceOver**: All interactive elements have `.accessibilityLabel()` and `.accessibilityHint()`
  ```swift
  Button("\(m)m") { timer.setPreset(minutes: m) }
      .accessibilityHint("Set preset to \(m) minutes")
  ```
- **High contrast**: Uses `Color.primary` and `.thinMaterial` for automatic dark mode support

### File Naming & Organization
```
mobile/
  MonoFocusApp.swift           # @main entry point, scene setup
  ViewModels/
    TimerViewModel.swift       # @MainActor, timer logic + persistence
  Views/
    TimerView.swift            # Main UI, custom ButtonStyles
    SetupView.swift            # Onboarding sheet (Shortcuts guidance)
  Services/
    NotificationService.swift  # @MainActor, UNUserNotificationCenter wrapper
    ShortcutService.swift      # @MainActor, Shortcuts URL launching
  Utils/
    URLRouter.swift            # Deep link parsing
    Theme.swift                # Generated design tokens
    generateTheme.swift        # Code generator script
  Models/
    FocusSession.swift         # Codable session model
  MonoFocusWidgets/
    MonoFocusWidgets.swift     # WidgetKit extension (separate target)
```
**Rule**: New ViewModels/Services must be `@MainActor` for SwiftUI thread safety.

## Project-Specific Patterns

### Zero External Dependencies Philosophy
**Hard rule**: No SPM packages, no CocoaPods, no external SDKs. MonoFocus uses only Apple frameworks:
- **SwiftUI**: All UI, state binding, navigation
- **WidgetKit**: Lock Screen/Home Screen widgets
- **UserNotifications**: Local end-of-session alerts
- **Combine**: Timer scheduling (`Timer.publish()`)
- **Foundation**: JSON persistence, URL routing

**Why**: Minimizes attack surface, eliminates supply chain risk, ensures long-term maintainability. If a feature requires external code, reconsider the feature.

### Monochrome Design System
Theme constants live in `mobile/Utils/Theme.swift` (generated from JSON tokens):
```swift
struct Theme {
    static let spacingXL: CGFloat = 32   // Large vertical gaps
    static let spacingL: CGFloat = 20    // Medium spacing
    static let spacingM: CGFloat = 12    // Tight spacing
    static let cornerRadius: CGFloat = 20

    static let monoPrimary = Color.primary      // Adapts to dark mode
    static let monoSecondary = Color.secondary
}
```
**Usage**: `VStack(spacing: Theme.spacingXL)`, `RoundedRectangle(cornerRadius: Theme.cornerRadius)`

**Extending**: Edit `design/figma-tokens.json` → run `swift mobile/Utils/generateTheme.swift` → commit both files.

### JSON Persistence (No CoreData)
Two files in `Documents/`:
1. **`timer-state.json`** (singleton):
   ```json
   {"total": 1500, "remaining": 1200, "running": false, "paused": false}
   ```
   - Written on `scenePhase == .background`
   - Read on `TimerViewModel.init()`
   - `isRunning`/`isPaused` always reset to `false` (no background timer)

2. **`sessions.json`** (array):
   ```json
   [
     {"id": "...", "start": "2025-10-21T10:00:00Z", "durationSeconds": 1500, "presetLabel": "25m", "completed": true}
   ]
   ```
   - Appended on `stop(save: true)` or when timer completes naturally
   - `completed: true` if timer reached 0, `false` if user stopped early

**Why not CoreData?** Overkill for simple append-only data. JSON is human-readable, easy to export (planned: CSV export feature).

### Shortcuts Integration (User-Controlled)
MonoFocus **never** automatically creates Shortcuts. Users must:
1. Create Shortcuts in iOS Shortcuts app (e.g., "MonoFocus DND" that enables Focus mode)
2. Enter exact name in app's Automation section
3. Tap "Run" to launch via `shortcuts://run-shortcut?name=<encoded>`

**Failure mode**: If shortcut doesn't exist, `UIApplication.shared.open()` fails silently (no error presented). This is intentional—optional feature, non-blocking.

**Example Shortcut flow** (from `SetupView.swift`):
- User creates "MonoFocus DND" Shortcut with "Set Focus → On"
- Enters "MonoFocus DND" in `TextField`
- Taps "Save Shortcut Names" → stored in `UserDefaults`
- On timer start, user manually taps "Run" button → opens Shortcuts app

**Future improvement** (TODO): AppIntents could let Shortcuts directly call timer actions without URL schemes.

### XcodeGen Project Structure
`project.yml` defines a **two-target** architecture:
```yaml
targets:
  MonoFocus:
    type: application
    platform: iOS
    sources:
      - path: mobile
        excludes: [MonoFocusWidgets/**]
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: "dev.monofocus.app"
    dependencies:
      - target: MonoFocusWidgets  # Embeds extension

  MonoFocusWidgets:
    type: app-extension
    platform: iOS
    sources: [mobile/MonoFocusWidgets]
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: "dev.monofocus.app.widgets"
```

**Key points**:
- Widget extension sources in separate `MonoFocusWidgets/` directory
- Main app **excludes** widget directory via `excludes` pattern
- Bundle ID hierarchy: `dev.monofocus.app` → `dev.monofocus.app.widgets`
- Dependency ensures widget builds when app builds

**When adding files**:
- App code → `mobile/` root or subdirectories (except `MonoFocusWidgets/`)
- Widget code → `mobile/MonoFocusWidgets/`
- Shared models → `mobile/Models/` (must manually add to both targets in future if needed)

### Sprint Phases (Development Context)
**Sprint 1 (MVP, completed)**:
- Core timer with start/pause/resume/stop
- Local notifications
- Three presets (25/45/90 minutes)
- Deep link URL scheme
- Static Lock Screen widget
- Shortcuts automation UI

**Sprint 2 (in progress per TODO.md)**:
- [ ] Timer backgrounding edge cases
- [ ] Live Activity (Lock Screen running timer)
- [ ] AppIntents (Siri integration)
- [ ] Session history CSV export

**Sprint 3 (planned)**:
- On-device adaptive durations (ML suggestions)
- Unit/UI tests for state transitions
- Settings panel for haptic/sound customization

**For AI agents**: Focus on MVP (Sprint 1) patterns. Live Activity and AppIntents are future work—design proposals welcome but don't refactor existing code prematurely.

## Common Pitfalls & Solutions

### 1. Forgetting `@MainActor` Annotation
**Problem**: New ViewModels/Services crash with "Publishing changes from background threads" error.

**Solution**: All classes that hold `@Published` properties or interact with SwiftUI **must** be `@MainActor`:
```swift
@MainActor
final class NewFeatureViewModel: ObservableObject {
    @Published var state: String = ""
}
```
**Why**: SwiftUI updates run on main thread. Without `@MainActor`, Combine publishers fire on arbitrary threads.

### 2. Timer Background Continuity
**Problem**: Timer stops counting when app goes to background.

**Current behavior (MVP limitation)**:
- `scenePhase == .background` triggers `persistState()` (saves remaining time)
- On restore, `isRunning` resets to `false` (timer not auto-resumed)
- User must manually restart

**Future fix** (Sprint 2):
- Option A: Background URLSession tasks (not ideal for timer)
- Option B: Live Activity with ActivityKit (recommended approach)
- Option C: Silent push notifications (requires server, violates offline-first principle)

**For now**: Document this limitation, don't try to hack background execution.

### 3. Shortcuts URL Scheme Brittleness
**Problem**: `shortcuts://run-shortcut?name=<encoded>` is undocumented, may break in iOS updates.

**Current approach**:
```swift
func runShortcut(named name: String) {
    guard !name.isEmpty else { return }
    if let url = URL(string: "shortcuts://run-shortcut?name=\(name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? name)") {
        UIApplication.shared.open(url)  // Fails silently if invalid
    }
}
```

**Error handling**: None (intentional). Feature is optional—if URL fails, user sees nothing. No alerts, no logging.

**Better approach** (Sprint 2): Use `AppIntents` framework for first-class Shortcuts integration:
```swift
// Future: AppIntent for starting timer
struct StartTimerIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Timer"
    @Parameter(title: "Minutes") var minutes: Int

    func perform() async throws -> some IntentResult {
        // Call TimerViewModel directly
        return .result()
    }
}
```

### 4. Widget Timeline Confusion
**Problem**: New developers expect widgets to show "live" remaining time.

**Actual behavior**: Widgets are **static**. They only display preset buttons:
```swift
struct WidgetView: View {
    var body: some View {
        HStack {
            Link("25", destination: URL(string: "monofocus://start?minutes=25")!)
            Link("45", destination: URL(string: "monofocus://start?minutes=45")!)
            Link("90", destination: URL(string: "monofocus://start?minutes=90")!)
        }
    }
}
```

**Why**: MVP simplicity. Timeline updates require:
- Shared data via `AppGroup` container
- Timeline scheduling logic
- Battery impact from updates

**Future enhancement** (Sprint 2): Add Live Activity for running timer (real-time updates on Lock Screen).

### 5. XcodeGen Regeneration
**Problem**: Adding new files, changing bundle IDs, or updating build settings directly in Xcode—changes lost on next `xcodegen generate`.

**Solution**: **Always** edit `project.yml`, never `.xcodeproj`:
```yaml
# Example: Adding a new setting
targets:
  MonoFocus:
    settings:
      base:
        SWIFT_VERSION: 5.9
        NEW_SETTING: value  # Add here, not in Xcode
```

Then regenerate:
```bash
xcodegen generate
```

**Files at risk**: `.xcodeproj` is gitignored. All configuration lives in `project.yml`.

### 6. Testing on Simulator vs. Device
**Simulator limitations**:
- Haptics don't trigger (no hardware feedback)
- Shortcuts URL scheme opens Shortcuts app but may not execute (sandboxing)
- Notifications may behave differently

**Device testing required for**:
- Haptic feedback validation
- Shortcuts automation flow
- Lock Screen widget interaction
- Background notification delivery

**Simulator sufficient for**:
- UI layout
- State machine logic
- Deep link parsing
- JSON persistence

### 7. Notification Permission Flow
**Problem**: Notifications silently fail if permission not granted.

**Proper sequence** (already implemented):
1. Request on first launch:
   ```swift
   .task {
       await notificationService.requestAuthorizationIfNeeded()
   }
   ```
2. Check `permissionGranted` before scheduling:
   ```swift
   func scheduleEndOfSessionNotification(inSeconds: TimeInterval) async {
       guard permissionGranted else { return }  // Silent fail
       // ... schedule notification
   }
   ```

**User visibility**: No error UI if permission denied. Notifications are optional—timer still functions.

### 8. Session Persistence on Early Stop
**Problem**: Unclear when to save incomplete sessions.

**Current logic**:
- `stop(save: true)` → Always persists, marks `completed: false` if `remainingSeconds > 0`
- `stop(save: false)` → Discards session (used for quick resets)
- Timer reaches 0 → Auto-persists with `completed: true`

**UI behavior**:
- "Stop" button in `TimerView` calls `stop(save: true)` (preserves partial sessions)
- Future: Settings toggle to auto-discard incomplete sessions

## Integration Points

### UserDefaults Storage
Used **only** for optional Shortcut names (non-critical data):
```swift
// ShortcutService.swift
@Published var dndShortcutName: String = UserDefaults.standard.string(forKey: "dndShortcutName") ?? ""
@Published var grayscaleShortcutName: String = UserDefaults.standard.string(forKey: "grayscaleShortcutName") ?? ""

func save() {
    UserDefaults.standard.set(dndShortcutName, forKey: "dndShortcutName")
    UserDefaults.standard.set(grayscaleShortcutName, forKey: "grayscaleShortcutName")
}
```
**Never** use UserDefaults for timer state or session history—JSON files provide better structure and export capabilities.

### FileManager Persistence
All critical data in `.documentDirectory`:
```swift
let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
storageURL = dir.appendingPathComponent("sessions.json")
stateURL = dir.appendingPathComponent("timer-state.json")
```

**File locations** (simulator):
```
~/Library/Developer/CoreSimulator/Devices/<UUID>/data/Containers/Data/Application/<UUID>/Documents/
  ├── sessions.json      # Array of FocusSession (append-only)
  └── timer-state.json   # Dictionary {total, remaining, running, paused}
```

**Read/Write pattern**:
```swift
// Write
if let data = try? JSONEncoder().encode(sessions) {
    try? data.write(to: storageURL)
}

// Read
let data = try? Data(contentsOf: storageURL)
let sessions = try? JSONDecoder().decode([FocusSession].self, from: data)
```

### URL Scheme Handling
Deep link flow for `monofocus://start?minutes=<N>`:

1. **Registration** (`Info.plist`):
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
       <dict>
           <key>CFBundleURLSchemes</key>
           <array><string>monofocus</string></array>
       </dict>
   </array>
   ```

2. **Capture** (`MonoFocusApp.swift`):
   ```swift
   .onOpenURL { url in
       URLRouter.handle(url: url, timerVM: timerVM)
   }
   ```

3. **Routing** (`URLRouter.swift`):
   ```swift
   static func handle(url: URL, timerVM: TimerViewModel) {
       guard url.scheme == "monofocus" else { return }
       if url.host == "start" {
           let minutes = parseQueryParam("minutes") ?? 25
           timerVM.setPreset(minutes: minutes)
           timerVM.start()
       }
   }
   ```

**Future routes** (when implementing):
- `monofocus://history` → Navigate to session history view
- `monofocus://stop` → Stop current timer

### Environment Object Injection
Three services injected at root level (`MonoFocusApp.swift`):
```swift
@StateObject private var timerVM = TimerViewModel()
@StateObject private var shortcutService = ShortcutService()
@StateObject private var notificationService = NotificationService()

var body: some Scene {
    WindowGroup {
        TimerView()
            .environmentObject(timerVM)
            .environmentObject(shortcutService)
            .environmentObject(notificationService)
    }
}
```

**Access in views**:
```swift
struct TimerView: View {
    @EnvironmentObject var timer: TimerViewModel
    @EnvironmentObject var shortcuts: ShortcutService
    @EnvironmentObject var notifications: NotificationService
}
```

**Caution**: Widgets **cannot** access environment objects. They must use static data or shared containers (future: AppGroup).

### Cross-Component Communication
- **Timer → Notification**: Direct call in `start()`/`resume()`:
  ```swift
  func start(notificationService: NotificationService? = nil) {
      // ... state changes
      scheduleEndNotification(using: notificationService)
  }
  ```
- **View → Timer**: Via environment object methods (no direct state mutation)
- **Widget → App**: Deep link URLs only (no shared state)

### Future Integration (Sprint 2+)
- **AppGroup**: For sharing timer state with widgets
  ```swift
  let sharedDefaults = UserDefaults(suiteName: "group.dev.monofocus.app")
  ```
- **ActivityKit**: For Live Activities showing running timer
- **AppIntents**: For Siri shortcuts and Focus Filter integration

## Next Steps (from TODO.md)
Priority features: Live Activity for running timer, AppIntents for Siri integration, session history CSV export.
