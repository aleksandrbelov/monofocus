# MONO-017: App Intents Migration Plan

**Status:** Planning  
**Priority:** High  
**Complexity:** Medium  
**Target iOS:** 18.0+  
**Estimated Effort:** 2–3 days

---

## Executive Summary

**Goal:** Replace the legacy Shortcuts URL scheme (`shortcuts://run-shortcut?name=...`) with modern App Intents framework for automation triggers (DND, Grayscale on/off).

**Why Migrate:**
- **Apple deprecation:** `shortcuts://` URL scheme is legacy and may break in future iOS versions
- **Better UX:** App Intents integrate natively with Shortcuts, Siri, Focus Filters, and Live Activities
- **Type safety:** Strongly-typed parameters and compile-time validation
- **Reliability:** No string-matching shortcut names; direct app-to-system integration
- **Privacy & security:** No URL scheme vulnerabilities; proper entitlements and scopes
- **Performance:** Direct invocation without inter-app URL routing overhead

**Key Challenge:**  
We currently rely on **user-created Shortcuts** with custom names that toggle system features (DND, Grayscale). App Intents cannot directly toggle system-level DND/Grayscale—only the Shortcuts app can orchestrate this. Migration uses pure App Intents with no legacy fallback.

---

## Current State Analysis

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ User creates Shortcuts in Shortcuts app:               │
│  • "MonoFocus DND" → Enable Focus Filter               │
│  • "MonoFocus Grayscale" → Set accessibility display   │
│  • "MonoFocus DND Off" → Disable Focus Filter          │
│  • "MonoFocus Grayscale Off" → Restore display         │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│ ShortcutService (mobile/Services/ShortcutService.swift) │
│  • Stores shortcut names in UserDefaults               │
│  • runShortcut(named:) → opens shortcuts:// URL        │
│  • runAutomationsOnStartOrResume() → triggers on start │
│  • markPendingOffIfEnabled() → defers off actions      │
│  • drainPendingOffIfAny() → runs off actions on fg     │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│ Invoked from:                                           │
│  • ContentView → onStart/onResume                       │
│  • MonoFocusApp → scene lifecycle (drainPending)        │
│  • MonoFocusApp → NotificationCenter (session complete) │
└─────────────────────────────────────────────────────────┘
```

### Existing App Intents (Partial Implementation)

**File:** `mobile/AppIntents/StartTimerIntent.swift`
- ✅ Implements `AppIntent` protocol
- ⚠️ Uses legacy URL scheme: `monofocus://start?minutes=\(minutes)`
- ⚠️ No integration with automation triggers

**File:** `mobile/AppIntents/StopTimerIntent.swift`
- ✅ Implements `AppIntent` protocol
- ⚠️ Uses legacy URL scheme: `monofocus://stop`
- ⚠️ No integration with automation triggers

**File:** `mobile/AppIntents/TimerShortcuts.swift`
- ✅ Defines `AppShortcutsProvider` with Siri phrases
- ⚠️ Limited to timer control only

### Integration Points

1. **Timer Start/Resume:**  
   `ContentView.swift:79,84` → `shortcuts.runAutomationsOnStartOrResume()`

2. **Session Completion:**  
   `MonoFocusApp.swift:53` → `shortcutService.markPendingOffIfEnabled()`  
   `MonoFocusApp.swift:54` → `shortcutService.drainPendingOffIfAny(onlyIfActive: true)`

3. **Foreground Return:**  
   `MonoFocusApp.swift:63` → `shortcutService.drainPendingOffIfAny(onlyIfActive: false)`

4. **UI Configuration:**  
   `AutomationSection.swift` → Toggles for DND/Grayscale automation  
   `TimerView.swift` → Manual shortcut name entry and test run

### Current Limitations

- ❌ Requires users to manually create and name shortcuts
- ❌ String-based name matching is error-prone
- ❌ No validation that shortcuts exist or work correctly
- ❌ URL scheme may fail silently if Shortcuts app changes behavior
- ❌ No support for Siri integration with automation triggers
- ❌ Cannot be invoked from widgets or Live Activities directly
- ❌ No testability—cannot mock URL scheme invocations

---

## Migration Strategy

### Option Analysis

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **A: Pure App Intents** | Modern, type-safe, Siri-ready | Cannot toggle system DND/Grayscale directly | ❌ Not feasible |
| **B: App Intents + Shortcut Callbacks** | Best UX, no manual naming, clean architecture | Requires user to run setup automation once | ✅ **Selected** |
| **C: Hybrid (keep URL scheme fallback)** | Backward compatible | Technical debt persists, split code paths | ❌ Not needed |

**Selected Approach:** **Option B** (pure App Intents, iOS 18+ only).

---

## Proposed Architecture

### New Intent Hierarchy

```swift
// Core automation protocol
protocol MonoFocusAutomationIntent: AppIntent {
    static var isDiscoverable: Bool { get }
}

// Timer control intents (refactored)
struct StartFocusSessionIntent: MonoFocusAutomationIntent { }
struct StopFocusSessionIntent: MonoFocusAutomationIntent { }
struct PauseFocusSessionIntent: MonoFocusAutomationIntent { }
struct ResumeFocusSessionIntent: MonoFocusAutomationIntent { }

// Automation trigger intents (NEW)
struct SessionDidStartIntent: MonoFocusAutomationIntent { }
struct SessionDidCompleteIntent: MonoFocusAutomationIntent { }
struct SessionDidResumeIntent: MonoFocusAutomationIntent { }
struct SessionWillEndIntent: MonoFocusAutomationIntent { }

// Query intents (NEW)
struct GetCurrentSessionStateIntent: AppIntent { }
struct GetAutomationConfigIntent: AppIntent { }
```

### Integration Flow

```
┌──────────────────────────────────────────────────────────┐
│ User creates ONE-TIME Shortcut via setup wizard:        │
│  1. "When MonoFocus starts session" → Enable Focus      │
│  2. "When MonoFocus completes session" → Disable Focus  │
│  3. "When MonoFocus starts session" → Enable Grayscale  │
│  4. "When MonoFocus completes session" → Disable Gray   │
└──────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────┐
│ AutomationService (replaces ShortcutService)            │
│  • IntentDonationManager → donates intents to system    │
│  • AutomationCoordinator → executes intents at events   │
│  • FallbackBridge → legacy URL scheme for iOS <16       │
└──────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Intent Donation Points:                                  │
│  • sessionDidStart → donates SessionDidStartIntent       │
│  • sessionDidComplete → donates SessionDidCompleteIntent │
│  • Shortcuts app listens and triggers user automations  │
└──────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Foundation (Day 1)

#### 1.1 Refactor Existing Intents
- [x] Current: `StartTimerIntent`, `StopTimerIntent` use URL scheme
- [ ] **Action:** Refactor to directly inject `TimerViewModel` via dependency
- [ ] **Files:**
  - `mobile/AppIntents/StartTimerIntent.swift`
  - `mobile/AppIntents/StopTimerIntent.swift`
- [ ] **Remove:** All `@available(iOS 16.0, *)` annotations (minimum is iOS 18)
- [ ] **New approach:**
  ```swift
  @MainActor
  func perform() async throws -> some IntentResult {
      let container = AppDependencyContainer.shared
      container.timerViewModel.start(notificationService: container.notificationService)
      return .result(dialog: "Focus session started")
  }
  ```

#### 1.2 Create Dependency Container
- [ ] **New file:** `mobile/Services/AppDependencyContainer.swift`
- [ ] **Purpose:** Singleton to inject services into intents
- [ ] **Contents:**
  ```swift
  @MainActor
  final class AppDependencyContainer {
      static let shared = AppDependencyContainer()
      
      private(set) var timerViewModel: TimerViewModel!
      private(set) var notificationService: NotificationService!
      private(set) var automationService: AutomationService!
      
      func configure(
          timerViewModel: TimerViewModel,
          notificationService: NotificationService,
          automationService: AutomationService
      ) {
          self.timerViewModel = timerViewModel
          self.notificationService = notificationService
          self.automationService = automationService
      }
  }
  ```

#### 1.3 Add Missing Intents
- [ ] **New file:** `mobile/AppIntents/PauseFocusSessionIntent.swift`
- [ ] **New file:** `mobile/AppIntents/ResumeFocusSessionIntent.swift`
- [ ] Update `TimerShortcuts.swift` to include pause/resume

---

### Phase 2: Automation Intent Donations (Day 2)

#### 2.1 Create Lifecycle Event Intents
- [ ] **New file:** `mobile/AppIntents/SessionDidStartIntent.swift`
  ```swift
  struct SessionDidStartIntent: AppIntent {
      static var title: LocalizedStringResource = "Session Started"
      static var description = IntentDescription(
          "Notifies when a focus session begins",
          categoryName: "Automation"
      )
      static var isDiscoverable: Bool = false // Not user-invokable
      
      @Parameter(title: "Duration (minutes)")
      var durationMinutes: Int
      
      func perform() async throws -> some IntentResult {
          // Intent is donated but does nothing—user's Shortcut responds
          return .result()
      }
  }
  ```

- [ ] **New file:** `mobile/AppIntents/SessionDidCompleteIntent.swift`
- [ ] **New file:** `mobile/AppIntents/SessionDidResumeIntent.swift`
- [ ] **New file:** `mobile/AppIntents/SessionWillEndIntent.swift` (for pause/stop)

#### 2.2 Create Intent Donation Manager
- [ ] **New file:** `mobile/Services/IntentDonationManager.swift`
  ```swift
  import AppIntents
  
  @MainActor
  final class IntentDonationManager {
      func donateSessionStart(durationMinutes: Int) {
          let intent = SessionDidStartIntent(durationMinutes: durationMinutes)
          Task {
              try? await intent.perform()
          }
      }
      
      func donateSessionComplete(elapsedMinutes: Int) {
          let intent = SessionDidCompleteIntent(elapsedMinutes: elapsedMinutes)
          Task {
              try? await intent.perform()
          }
      }
      
      func donateSessionResume(remainingMinutes: Int) {
          let intent = SessionDidResumeIntent(remainingMinutes: remainingMinutes)
          Task {
              try? await intent.perform()
          }
      }
      
      func donateSessionWillEnd(reason: SessionEndReason) {
          let intent = SessionWillEndIntent(reason: reason)
          Task {
              try? await intent.perform()
          }
      }
  }
  
  enum SessionEndReason: String, AppEnum {
      case completed, paused, stopped
      static var typeDisplayRepresentation: TypeDisplayRepresentation = "End Reason"
      static var caseDisplayRepresentations: [SessionEndReason: DisplayRepresentation] = [
          .completed: "Completed",
          .paused: "Paused",
          .stopped: "Stopped"
      ]
  }
  ```

---

### Phase 3: Replace ShortcutService (Day 3)

#### 3.1 Create AutomationService
- [ ] **New file:** `mobile/Services/AutomationService.swift`
  ```swift
  @MainActor
  final class AutomationService: ObservableObject {
      private let donationManager = IntentDonationManager()
      
      @Published var isDNDAutomationEnabled: Bool {
          didSet { UserDefaults.standard.set(isDNDAutomationEnabled, forKey: "dndAutomationEnabled") }
      }
      
      @Published var isGrayscaleAutomationEnabled: Bool {
          didSet { UserDefaults.standard.set(isGrayscaleAutomationEnabled, forKey: "grayscaleAutomationEnabled") }
      }
      
      init() {
          isDNDAutomationEnabled = UserDefaults.standard.bool(forKey: "dndAutomationEnabled")
          isGrayscaleAutomationEnabled = UserDefaults.standard.bool(forKey: "grayscaleAutomationEnabled")
      }
      
      func notifySessionStart(durationMinutes: Int) {
          guard isDNDAutomationEnabled || isGrayscaleAutomationEnabled else { return }
          donationManager.donateSessionStart(durationMinutes: durationMinutes)
      }
      
      func notifySessionComplete(elapsedMinutes: Int) {
          guard isDNDAutomationEnabled || isGrayscaleAutomationEnabled else { return }
          donationManager.donateSessionComplete(elapsedMinutes: elapsedMinutes)
      }
      
      func notifySessionResume(remainingMinutes: Int) {
          guard isDNDAutomationEnabled || isGrayscaleAutomationEnabled else { return }
          donationManager.donateSessionResume(remainingMinutes: remainingMinutes)
      }
  }
  ```

#### 3.2 Update Integration Points
- [ ] **File:** `mobile/App/ContentView.swift`
  ```swift
  // Replace:
  shortcuts.runAutomationsOnStartOrResume()
  
  // With:
  automation.notifySessionStart(durationMinutes: timer.totalSeconds / 60)
  automation.notifySessionResume(remainingMinutes: timer.remainingSeconds / 60)
  ```

- [ ] **File:** `mobile/MonoFocusApp.swift`
  ```swift
  // Replace:
  shortcutService.markPendingOffIfEnabled()
  shortcutService.drainPendingOffIfAny(onlyIfActive: true)
  
  // With:
  automation.notifySessionComplete(elapsedMinutes: timerVM.totalSeconds / 60)
  ```

#### 3.3 Update UI
- [ ] **File:** `mobile/DesignSystem/Components/AutomationSection.swift`
  - Remove manual shortcut name fields
  - Add "Setup Automations" button → deep link to Shortcuts app
  - Display connection status (if Shortcuts responds to donations)
  
- [ ] **File:** `mobile/Views/SetupView.swift` (if exists, or create)
  - Add automation setup wizard with step-by-step Shortcut creation guide
  - Include deep links: `shortcuts://gallery/...` (if available)
  - Provide templates for users to import

---

### Phase 4: Testing & Validation (Day 2)

#### 4.1 Unit Tests
- [ ] **New file:** `Tests/AutomationServiceTests.swift`
  ```swift
  @MainActor
  func test_notifySessionStart_donatesIntent_whenAutomationEnabled() async {
      let service = AutomationService()
      service.isDNDAutomationEnabled = true
      
      // Verify intent donation occurs (may require mocking)
      service.notifySessionStart(durationMinutes: 25)
      // Assert: Intent was donated to system
  }
  
  @MainActor
  func test_notifySessionStart_skipsIntent_whenAutomationDisabled() {
      let service = AutomationService()
      service.isDNDAutomationEnabled = false
      service.isGrayscaleAutomationEnabled = false
      
      service.notifySessionStart(durationMinutes: 25)
      // Assert: No intent donated
  }
  ```

- [ ] **Delete file:** `Tests/ShortcutServiceTests.swift`
  - No longer needed; ShortcutService removed entirely

#### 4.2 Integration Tests (Manual)
- [ ] Verify intent donations appear in Shortcuts app automation triggers
- [ ] Create test Shortcuts:
  - "On Session Start" → Show notification "DND ON"
  - "On Session Complete" → Show notification "DND OFF"
- [ ] Test scenarios:
  - Start timer → Shortcuts trigger fires
  - Complete timer → Shortcuts trigger fires
  - Pause/resume → Appropriate intents donated
  - App backgrounded → Intents still donated on foreground return

#### 4.3 Accessibility & Compatibility
- [ ] Test with VoiceOver: automation toggles announced correctly
- [ ] Test on iOS 18.0, 18.1, 18.2 (current + minor versions)

---

### Phase 3: Documentation & Rollout (Day 3)

#### 5.1 Update Documentation
- [ ] **File:** `README.md`
  - Replace Shortcuts URL scheme instructions with App Intents setup
  - Add "Setting Up Automations" section with screenshots
  
- [ ] **New file:** `docs/AUTOMATION_SETUP_GUIDE.md`
  - Step-by-step Shortcut creation
  - Template Shortcuts (exportable `.shortcut` files if possible)
  - Troubleshooting: "My automations don't trigger"

- [ ] **File:** `docs/API_REFERENCE.md`
  - Document all new App Intents
  - Include Siri phrase examples
  - Document intent parameters and error cases

#### 5.2 Migration Guide for Users
- [ ] **New file:** `docs/MIGRATION_GUIDE_V2.md`
  - Explain why old shortcut names no longer work
  - Provide migration steps from legacy to App Intents
  - FAQ: "Do I need to recreate my shortcuts?"

#### 3.3 Cleanup
- [ ] **Delete** `mobile/Services/ShortcutService.swift` entirely
- [ ] Remove all `shortcuts://` URL scheme handling code
- [ ] Delete `Tests/ShortcutServiceTests.swift`
- [ ] Update project minimum deployment target to iOS 18.0 in `project.yml`

---

## File Structure After Migration

```
mobile/
├── AppIntents/
│   ├── Timer/
│   │   ├── StartFocusSessionIntent.swift          [REFACTORED]
│   │   ├── StopFocusSessionIntent.swift           [REFACTORED]
│   │   ├── PauseFocusSessionIntent.swift          [NEW]
│   │   └── ResumeFocusSessionIntent.swift         [NEW]
│   ├── Automation/
│   │   ├── SessionDidStartIntent.swift            [NEW]
│   │   ├── SessionDidCompleteIntent.swift         [NEW]
│   │   ├── SessionDidResumeIntent.swift           [NEW]
│   │   └── SessionWillEndIntent.swift             [NEW]
│   ├── Query/
│   │   ├── GetCurrentSessionStateIntent.swift     [NEW]
│   │   └── GetAutomationConfigIntent.swift        [NEW]
│   └── TimerShortcuts.swift                       [UPDATED]
├── Services/
│   ├── AutomationService.swift                    [NEW]
│   ├── IntentDonationManager.swift                [NEW]
│   ├── AppDependencyContainer.swift               [NEW]
│   ├── NotificationService.swift
│   └── TimerViewModel.swift
├── Views/
│   ├── SetupView.swift                            [UPDATED]
│   └── AutomationSetupWizard.swift                [NEW]
├── DesignSystem/
│   └── Components/
│       └── AutomationSection.swift                [UPDATED]
Tests/
├── AutomationServiceTests.swift                   [NEW]
└── IntentDonationManagerTests.swift               [NEW]
```

---

## Key Decisions & Trade-offs

### 1. Why Not Direct System API Calls?
**Decision:** Use App Intents + user-created Shortcuts instead of private APIs.  
**Rationale:**
- No public API to toggle DND/Focus Filters or Grayscale
- Private API usage = App Store rejection
- App Intents + Shortcuts is Apple's recommended approach for cross-app automation

**Trade-off:**  
Users must create Shortcuts once. Mitigated by providing templates and wizard.

---

### 2. Intent Donation vs. Direct Execution
**Decision:** Donate intents; let Shortcuts app orchestrate system changes.  
**Rationale:**
- Intents are lightweight signals ("session started")
- Shortcuts can chain complex actions (DND + Grayscale + Notify)
- More flexible for users to customize

**Trade-off:**  
No direct feedback if automation fails. Mitigated by logging and setup validation.

---

### 3. iOS 18+ Only
**Decision:** Drop support for iOS <18; remove `ShortcutService` entirely.  
**Rationale:**
- Clean architecture with no legacy code paths
- App Intents mature and stable by iOS 18
- Simplifies testing and maintenance
- iOS 18 adoption rate sufficient by Dec 2025

**Trade-off:**  
Users on older iOS cannot upgrade. Acceptable given product strategy.

---

### 4. Dependency Injection for Intents
**Decision:** Use `AppDependencyContainer` singleton.  
**Rationale:**
- App Intents are instantiated by system; no SwiftUI environment
- Singleton avoids complex protocol indirection

**Trade-off:**  
Global state, but scoped to app lifecycle. Alternative (dependency protocol) adds boilerplate.

---

## Success Criteria

### Functional
- ✅ Timer start/stop/pause/resume intents work via Siri
- ✅ Automation intents donated at correct lifecycle events
- ✅ User-created Shortcuts trigger when intents donated
- ✅ No regressions in timer functionality
- ✅ Clean removal of all legacy ShortcutService code

### Non-Functional
- ✅ Zero force unwraps; all intents use proper error handling
- ✅ Unit test coverage ≥ 80% for new services
- ✅ VoiceOver announces automation states correctly
- ✅ Setup wizard reduces support requests by 50%
- ✅ Intent latency < 100ms (measured via Instruments)

### Documentation
- ✅ API reference for all intents
- ✅ User-facing automation setup guide with screenshots
- ✅ Migration guide for existing users
- ✅ Release notes explaining changes

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Users don't create Shortcuts | High | Medium | Provide setup wizard with copy-pasteable templates |
| Intent donation fails silently | Medium | Low | Add diagnostic logging; show connection status in UI |
| Shortcuts app changes behavior | High | Low | Test on beta iOS; subscribe to Apple dev forums |
| Performance regression from intent overhead | Low | Low | Profile with Instruments; intents are async and non-blocking |
| Users on iOS <18 cannot upgrade | Medium | Low | Communicate minimum iOS requirement in App Store description |

---

## Performance Considerations

### Intent Donation Overhead
- **Concern:** Donating intents on every timer event could impact UI responsiveness.
- **Mitigation:**
  - Intents donated in background Task
  - Non-blocking; does not suspend main thread
  - Profiling target: <50ms per donation
  - Rate limit: max 1 donation per event type per second

### Memory Footprint
- **Concern:** Additional service layers increase memory usage.
- **Mitigation:**
  - `IntentDonationManager` is stateless
  - `AutomationService` reuses existing UserDefaults keys
  - Target: <100KB additional memory vs. legacy

---

## Testing Strategy

### Unit Tests (New)
- `AutomationServiceTests.swift`: notification methods, toggle states
- `IntentDonationManagerTests.swift`: intent creation, parameter validation
- `AppDependencyContainerTests.swift`: configuration lifecycle

### Integration Tests (Manual)
1. **Happy Path:**
   - Enable DND automation → Start timer → Verify Shortcut fires
   - Complete timer → Verify off automation fires
2. **Edge Cases:**
   - Toggle automation mid-session → Verify no double-trigger
   - Background timer → Verify intent donated on foreground return
   - Rapid start/stop cycles → Verify no rate limit issues
3. **Accessibility:**
   - VoiceOver reads automation status
   - Dynamic Type scales setup instructions

### Regression Tests
- All existing timer tests must pass
- Widget URL handling unchanged
- Live Activity updates unaffected

---

## Rollout Plan

### Phase 1: Internal Alpha (Week 1)
- Deploy to TestFlight internal testers
- Gather feedback on setup wizard UX
- Monitor crash logs for intent errors

### Phase 2: Public Beta (Week 2-3)
- Deploy to TestFlight public beta (100 users)
- A/B test: 50% new intents, 50% legacy
- Measure automation success rate

### Phase 3: Staged Rollout (Week 4)
- 10% production users (App Store gradual release)
- Monitor support tickets for confusion
- Publish knowledge base articles

### Phase 4: Full Release (Week 4)
- 100% rollout with release notes
- Minimum iOS 18.0 requirement enforced

---

## Definition of Done

- [ ] All Phase 1-3 tasks completed
- [ ] Unit tests green (≥80% coverage for new code)
- [ ] Integration tests pass on iOS 18.0, 18.1, 18.2
- [ ] Accessibility audit complete (VoiceOver, Dynamic Type)
- [ ] Documentation updated (README, API_REFERENCE, MIGRATION_GUIDE)
- [ ] Setup wizard tested with 5 non-technical users (100% completion rate)
- [ ] No new compiler warnings
- [ ] Static analysis clean (SwiftLint, no force unwraps)
- [ ] Performance profiled: intent donation <50ms, no memory leaks
- [ ] Approved by product owner and design review

---

## Open Questions

1. **Shortcut Templates:**  
   Can we export `.shortcut` files for users to import? Or must they recreate manually?  
   → **Action:** Research `shortcuts://import-shortcut` deep links.

2. **Intent Discovery:**  
   Should automation intents be `isDiscoverable: true` so they appear in Shortcuts gallery?  
   → **Decision:** No—they're lifecycle signals, not user actions.

3. **Focus Filter Integration:**  
   Can we directly integrate with Focus Filters API (iOS 18+)?  
   → **Action:** Investigate `ActivityKit` and Focus Filter entitlements.

4. **Widget Integration:**  
   Should widget taps donate intents too?  
   → **Decision:** Yes—widgets use same URL scheme, refactor to donate intents.

---

## References

- [App Intents Documentation](https://developer.apple.com/documentation/appintents/)
- [App Shortcuts Overview](https://developer.apple.com/documentation/appintents/app-shortcuts)
- [Donating Shortcuts](https://developer.apple.com/documentation/sirikit/donating_shortcuts)
- [Focus Filters (WWDC22)](https://developer.apple.com/videos/play/wwdc2022/10121/)
- [Testing App Intents](https://developer.apple.com/documentation/appintents/testing-app-intents)

---

## Next Steps

1. **Review with team:** Schedule 1-hour kickoff to align on approach
2. **Spike research:** Investigate Shortcut import/export APIs (2 hours)
3. **Create ticket breakdown:** Split this plan into Jira/Linear tickets
4. **Design setup wizard:** Work with design team on automation setup UX
5. **Begin Phase 1:** Start refactoring existing intents

---

**Last Updated:** 2025-12-04  
**Author:** Senior iOS Developer  
**Status:** Awaiting approval
