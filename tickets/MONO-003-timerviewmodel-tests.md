# MONO-003: Add TimerViewModel Unit Tests

**Type:** Testing  
**Priority:** 🟡 High  
**Status:** Ready for Development  
**Estimate:** 4 hours  
**Phase:** 2 (Quality Improvements)

---

## 📝 Description

Expand `TimerViewModelTests.swift` from 1 test to comprehensive coverage of timer logic, state transitions, persistence, and edge cases. Target: 80%+ coverage of TimerViewModel.

**Current Coverage:** ~5% (1 test)  
**Target Coverage:** 80%+

---

## 🎯 Acceptance Criteria

- [ ] Minimum 15 test cases covering core timer functionality
- [ ] All state transitions tested (idle → running → paused → stopped)
- [ ] Background/foreground transitions tested
- [ ] Persistence and restoration tested
- [ ] Edge cases covered (0 time, negative time, clock drift)
- [ ] All tests pass in CI/CD pipeline
- [ ] Code coverage report shows 80%+ for TimerViewModel

---

## 🔧 Test Cases to Implement

### **1. Preset Management**
```swift
func test_setPreset_updatesTimeCorrectly() async {
    let vm = await TimerViewModel()
    await vm.setPreset(minutes: 45)
    
    await MainActor.run {
        XCTAssertEqual(vm.totalSeconds, 2700)
        XCTAssertEqual(vm.remainingSeconds, 2700)
        XCTAssertEqual(vm.lastPreset, 45)
    }
}

func test_setPreset_whileRunning_isIgnored() async {
    let vm = await TimerViewModel()
    await vm.setPreset(minutes: 25)
    await vm.start()
    await vm.setPreset(minutes: 45)
    
    await MainActor.run {
        XCTAssertEqual(vm.totalSeconds, 1500)  // Unchanged
    }
}
```

### **2. Timer Lifecycle**
```swift
func test_start_transitionsToRunningState() async {
    let vm = await TimerViewModel()
    await vm.setPreset(minutes: 1)
    await vm.start()
    
    await MainActor.run {
        XCTAssertTrue(vm.isRunning)
        XCTAssertFalse(vm.isPaused)
    }
}

func test_pause_transitionsToCorrectState() async {
    let vm = await TimerViewModel()
    await vm.start()
    await vm.pause()
    
    await MainActor.run {
        XCTAssertFalse(vm.isRunning)
        XCTAssertTrue(vm.isPaused)
    }
}

func test_resume_fromPaused_works() async {
    let vm = await TimerViewModel()
    await vm.start()
    await vm.pause()
    await vm.resume()
    
    await MainActor.run {
        XCTAssertTrue(vm.isRunning)
        XCTAssertFalse(vm.isPaused)
    }
}

func test_stop_resetsTimer() async {
    let vm = await TimerViewModel()
    await vm.start()
    try? await Task.sleep(for: .seconds(2))
    await vm.stop(save: false)
    
    await MainActor.run {
        XCTAssertFalse(vm.isRunning)
        XCTAssertFalse(vm.isPaused)
        XCTAssertEqual(vm.remainingSeconds, vm.totalSeconds)
    }
}
```

### **3. Clock Synchronization**
```swift
func test_countdown_decreasesTime() async {
    let vm = await TimerViewModel()
    await vm.setPreset(minutes: 1)
    await vm.start()
    
    let initial = await vm.remainingSeconds
    try? await Task.sleep(for: .seconds(2))
    let after = await vm.remainingSeconds
    
    XCTAssertLessThan(after, initial)
    XCTAssertGreaterThanOrEqual(initial - after, 1)
}

func test_timerCompletion_emitsNotification() async {
    let exp = expectation(description: "completion")
    let token = NotificationCenter.default.addObserver(
        forName: .timerSessionCompleted, 
        object: nil, 
        queue: .main
    ) { _ in exp.fulfill() }
    defer { NotificationCenter.default.removeObserver(token) }
    
    let vm = await TimerViewModel()
    await vm._test_emitCompletionNotification()
    
    await fulfillment(of: [exp], timeout: 1.0)
}
```

### **4. Persistence & Restoration**
```swift
func test_persistState_savesCorrectly() async {
    let vm = await TimerViewModel()
    await vm.setPreset(minutes: 30)
    await vm.start()
    await vm.persistState()
    
    // Create new instance to test restoration
    let restored = await TimerViewModel()
    await MainActor.run {
        XCTAssertEqual(restored.totalSeconds, 1800)
        XCTAssertTrue(restored.isRunning)
    }
}

func test_sessionPersistence_completedSession() async {
    let vm = await TimerViewModel()
    await vm.setPreset(minutes: 1)
    await vm.start()
    await vm.stop(save: true)
    
    let sessions = await vm.loadSessions()
    XCTAssertEqual(sessions.count, 1)
    XCTAssertFalse(sessions[0].completed)  // Stopped early
}
```

### **5. Edge Cases**
```swift
func test_zeroTime_handledGracefully() async {
    let vm = await TimerViewModel()
    await vm.setPreset(minutes: 0)
    
    await MainActor.run {
        XCTAssertEqual(vm.totalSeconds, 0)
    }
}

func test_backgroundForeground_syncsClock() async {
    let vm = await TimerViewModel()
    await vm.setPreset(minutes: 5)
    await vm.start()
    
    await vm.prepareForBackground()
    try? await Task.sleep(for: .seconds(2))
    await vm.handleSceneDidBecomeActive(notificationService: nil)
    
    await MainActor.run {
        XCTAssertTrue(vm.isRunning)
        // Time should have elapsed during background
    }
}
```

---

## 📋 Subtasks

- [ ] Set up test file structure
- [ ] Add preset management tests (2 tests)
- [ ] Add lifecycle tests (4 tests)
- [ ] Add clock synchronization tests (2 tests)
- [ ] Add persistence tests (2 tests)
- [ ] Add edge case tests (3 tests)
- [ ] Add background task tests (2 tests)
- [ ] Run coverage report: `xcodebuild test -enableCodeCoverage YES`
- [ ] Verify 80%+ coverage achieved

---

## 🧪 Running Tests

```bash
# Command line
cd MonoFocus
xcodegen generate
xcodebuild test \
  -project MonoFocus.xcodeproj \
  -scheme MonoFocus \
  -destination 'platform=iOS Simulator,name=iPhone 14' \
  -enableCodeCoverage YES

# Xcode
Cmd+U (run all tests)
Cmd+6 → Test Navigator → View coverage
```

---

## 🔗 Related

- **Code Review:** Issue #1 (High Priority)
- **Files Changed:**
  - `Tests/TimerViewModelTests.swift` (expand)
- **Dependencies:** None (blocking Phase 1 completion recommended)

---

## ⚠️ Risks

- **Time Estimation Risk:** May take longer if timer timing issues found
- **Flakiness Risk:** Tests involving `Task.sleep()` may be flaky—use tolerances

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
