# MONO-018: AppIntent Integration Tests

**Type:** Testing  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 3 hours  
**Sprint:** 3 (Quality & Developer Experience)

---

## 📝 Description

Add integration tests covering all four user-invokable `AppIntent` types and the `IntentDonationManager` to ensure Siri and Shortcuts interactions work correctly and regressions are caught automatically.

---

## 🎯 Acceptance Criteria

- [ ] `StartTimerIntent` test: starts timer with correct duration
- [ ] `StopTimerIntent` test: stops a running timer and persists session
- [ ] `PauseFocusSessionIntent` test: pauses a running timer; no-ops on idle
- [ ] `ResumeFocusSessionIntent` test: resumes a paused timer; no-ops if not paused
- [ ] `IntentDonationManager` tests: correct intent donated at each lifecycle event
- [ ] All tests pass in CI without a device (use mock `TimerViewModel`)

---

## 🧪 Test Cases

```swift
// StartTimerIntent
func testStartTimerIntentSetsCorrectDuration() async throws {
    var intent = StartTimerIntent()
    intent.minutes = 45
    let result = try await intent.perform()
    XCTAssertEqual(container.timerVM.totalSeconds, 45 * 60)
    XCTAssertTrue(container.timerVM.isRunning)
}

// StopTimerIntent
func testStopTimerIntentStopsRunningTimer() async throws {
    container.timerVM.setPreset(minutes: 25)
    container.timerVM.start()
    let result = try await StopTimerIntent().perform()
    XCTAssertFalse(container.timerVM.isRunning)
}

// PauseIntent no-op when idle
func testPauseIntentIsNoOpWhenTimerIdle() async {
    let intent = PauseFocusSessionIntent()
    // Should not throw; timer stays idle
    _ = try? await intent.perform()
    XCTAssertFalse(container.timerVM.isRunning)
    XCTAssertFalse(container.timerVM.isPaused)
}
```

---

## 📋 Implementation Notes

- Use `AppDependencyContainer.shared` with a test double for `TimerViewModel`
- Mock `AutomationService` to avoid Shortcuts URL calls during tests
- Tests should run without entitlements (no App Group access required for unit tests)

---

## 🔗 Related

- `mobile/AppIntents/StartTimerIntent.swift`
- `mobile/AppIntents/Timer/PauseFocusSessionIntent.swift`
- `mobile/Services/IntentDonationManager.swift`
- MONO-003 (TimerViewModel unit tests must pass first)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 3
