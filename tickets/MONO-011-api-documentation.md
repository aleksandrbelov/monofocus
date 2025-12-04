# MONO-011: Add Inline API Documentation

**Type:** Documentation  
**Priority:** 🟢 Medium  
**Status:** Ready for Development  
**Estimate:** 4 hours  
**Phase:** 3 (Polish & Documentation)

---

## 📝 Description

Add comprehensive inline documentation (doc comments) to all public types, protocols, and methods to improve code maintainability and enable generated documentation.

**Current Coverage:** ~10% (minimal comments)  
**Target Coverage:** 80%+ of public APIs

---

## 🎯 Acceptance Criteria

- [ ] All public classes/structs have doc comments
- [ ] All public methods have doc comments
- [ ] All public properties have doc comments
- [ ] Complex algorithms documented with inline comments
- [ ] Concurrency expectations documented
- [ ] Code examples provided for key APIs
- [ ] Documentation builds without warnings

---

## 📚 Documentation Standards

### **Format: Swift DocC**
```swift
/// Brief one-line description.
///
/// Detailed explanation spanning multiple lines if needed.
/// Can include implementation notes, usage examples, and warnings.
///
/// - Parameters:
///   - param1: Description of first parameter
///   - param2: Description of second parameter
/// - Returns: Description of return value
/// - Throws: Conditions under which this throws
/// - Important: Critical information users must know
/// - Note: Additional contextual information
/// - Warning: Potential pitfalls or gotchas
```

---

## 🔧 Files to Document

### **1. TimerViewModel.swift** (Highest Priority)

```swift
/// Manages timer state, background execution, and session persistence.
///
/// `TimerViewModel` is the core business logic layer for the focus timer.
/// It handles countdown logic, state transitions (idle → running → paused),
/// background task scheduling, Live Activity updates, and session history.
///
/// ## Thread Safety
/// All methods must be called from the main actor. State mutations trigger
/// SwiftUI view updates via `@Published` properties.
///
/// ## Persistence
/// Timer state is persisted to `timer-state.json` on every mutation.
/// Session history is appended to `sessions.json` upon completion.
///
/// ## Background Execution
/// When the app enters background, the timer schedules a `BGProcessingTask`
/// to sync remaining time near completion. Clock drift is corrected on
/// foreground transition by comparing `Date()` against the stored `endDate`.
///
/// - Important: Call `handleSceneDidBecomeActive(notificationService:)` when
///   app returns to foreground to sync clock and reschedule notifications.
@MainActor
final class TimerViewModel: ObservableObject {
    /// Total duration of the current timer preset in seconds.
    @Published var totalSeconds: Int = 1500
    
    /// Remaining time in the current countdown, synchronized with wall clock.
    ///
    /// This value is updated every second via a `Timer.publish()` subscription
    /// and is recalculated from `endDate` on background/foreground transitions.
    @Published var remainingSeconds: Int = 1500
    
    /// Whether the timer is actively counting down.
    @Published var isRunning: Bool = false
    
    /// Whether the timer is paused (stopped but preserving remaining time).
    @Published var isPaused: Bool = false
    
    // ... document other properties and methods
}
```

---

### **2. NotificationService.swift**

```swift
/// Manages local notification permissions and end-of-session alerts.
///
/// `NotificationService` wraps `UNUserNotificationCenter` to request
/// authorization and schedule timer completion notifications. All operations
/// are asynchronous and fail gracefully if permission is denied.
///
/// ## Permission Flow
/// 1. On first launch, `requestAuthorizationIfNeeded()` prompts the user.
/// 2. If granted, `permissionGranted` becomes `true`.
/// 3. Subsequent calls check existing authorization without re-prompting.
///
/// ## Notification Behavior
/// - **Identifier:** `"end-of-session"`
/// - **Trigger:** `UNTimeIntervalNotificationTrigger` with specified delay
/// - **Content:** "Session complete. Nice work. Time to breathe."
///
/// - Note: Notifications are optional—the timer functions correctly even if
///   permission is denied. Silent failures ensure no user-facing errors.
@MainActor
final class NotificationService: ObservableObject {
    /// Whether notification permission has been granted by the user.
    @Published var permissionGranted = false
    
    /// Requests notification authorization if not already determined.
    ///
    /// This method checks the current authorization status and prompts the
    /// user only if the status is `.notDetermined`. Subsequent calls are no-ops.
    ///
    /// - Important: Call this early in the app lifecycle (e.g., in `.task` modifier).
    func requestAuthorizationIfNeeded() async { ... }
    
    /// Schedules a local notification to fire after the specified delay.
    ///
    /// If permission is denied, this method returns immediately without error.
    /// The notification uses the identifier `"end-of-session"` and can be
    /// cancelled by removing pending requests with that identifier.
    ///
    /// - Parameter inSeconds: Delay in seconds before the notification fires.
    ///   Values ≤0 are clamped to 1 second minimum.
    func scheduleEndOfSessionNotification(inSeconds: TimeInterval) async { ... }
}
```

---

### **3. ShortcutService.swift**

```swift
/// Manages integration with iOS Shortcuts for DND and grayscale automation.
///
/// `ShortcutService` stores user-configured Shortcut names in `UserDefaults`
/// and triggers them via the `shortcuts://` URL scheme. It handles:
/// - Enabling/disabling automations (toggles)
/// - Running "on" shortcuts when timer starts
/// - Queueing "off" shortcuts to run when timer completes or app returns to foreground
///
/// ## Shortcut Lifecycle
/// 1. User enters shortcut names in the Automation section
/// 2. When timer starts, enabled "on" shortcuts run immediately
/// 3. When timer completes, "off" shortcuts are queued (`markPendingOffIfEnabled()`)
/// 4. When app returns to foreground, queued "off" shortcuts drain (`drainPendingOffIfAny()`)
///
/// - Note: Shortcuts are triggered via `UIApplication.shared.open()` and execute
///   outside the app's sandbox. Errors are logged but don't block timer operation.
@MainActor
final class ShortcutService: ObservableObject { ... }
```

---

### **4. URLRouter.swift**

```swift
/// Routes deep links and widget taps to timer actions.
///
/// Supported URL schemes:
/// - `monofocus://start?minutes=<N>`: Start timer with N minutes
/// - `monofocus://stop`: Stop current timer
///
/// ## Usage
/// ```swift
/// .onOpenURL { url in
///     URLRouter.handle(url: url, timerVM: timerVM, notificationService: notificationService)
/// }
/// ```
///
/// - Important: Pass `notificationService` to ensure notifications are scheduled
///   when timers are started via deep links or widgets.
enum URLRouter { ... }
```

---

### **5. FocusSession.swift**

```swift
/// A completed or partial focus session record.
///
/// `FocusSession` instances are persisted to `sessions.json` and used for
/// session history export and analytics.
///
/// ## Properties
/// - `id`: Unique identifier (UUID)
/// - `start`: Session start timestamp
/// - `durationSeconds`: Elapsed time (may be less than preset if stopped early)
/// - `presetLabel`: Original preset label (e.g., "25m"), or `nil` for custom times
/// - `completed`: Whether the timer reached 0:00 (true) or was stopped early (false)
struct FocusSession: Codable, Identifiable { ... }
```

---

## 📋 Subtasks

- [ ] Document TimerViewModel (1.5h)
- [ ] Document NotificationService (30m)
- [ ] Document ShortcutService (30m)
- [ ] Document URLRouter (20m)
- [ ] Document FocusSession (10m)
- [ ] Document key DesignSystem components (30m)
- [ ] Add inline comments for complex algorithms (30m)
- [ ] Generate documentation: `xcodebuild docbuild`
- [ ] Review generated docs in Xcode
- [ ] Fix any documentation warnings

---

## 🧪 Generating Documentation

```bash
# Generate DocC archive
xcodebuild docbuild \
  -project MonoFocus.xcodeproj \
  -scheme MonoFocus \
  -destination 'platform=iOS Simulator,name=iPhone 14'

# Preview in Xcode
# Open Xcode → Product → Build Documentation
# View in Documentation Viewer (Cmd+Shift+0)
```

---

## 🔗 Related

- **Code Review:** Issue #7 (Medium Priority)
- **Files Changed:**
  - `mobile/ViewModels/TimerViewModel.swift`
  - `mobile/Services/NotificationService.swift`
  - `mobile/Services/ShortcutService.swift`
  - `mobile/Utils/URLRouter.swift`
  - `mobile/Models/FocusSession.swift`

---

## ⚠️ Risks

- **Low Risk:** Documentation-only changes, no behavioral impact
- **Time Estimate:** May take longer for comprehensive coverage

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
