# MONO-005: Add URLRouter Unit Tests

**Type:** Testing  
**Priority:** 🟡 High  
**Status:** Blocked by MONO-001  
**Estimate:** 1 hour  
**Phase:** 2 (Quality Improvements)

---

## 📝 Description

Create unit tests for `URLRouter` to verify deep link parsing and timer control via URL schemes.

**Current Coverage:** 0% (no tests)  
**Target Coverage:** 100%

---

## 🎯 Acceptance Criteria

- [ ] All URL schemes tested (start, stop)
- [ ] Query parameter parsing validated
- [ ] Edge cases covered (invalid URLs, missing parameters)
- [ ] Integration with TimerViewModel verified
- [ ] All tests pass in CI/CD

---

## 🔧 Test Cases to Implement

### **1. Start Command**
```swift
@MainActor
func test_startURL_withValidMinutes_startsTimer() {
    let timerVM = TimerViewModel()
    let notificationService = NotificationService()
    let url = URL(string: "monofocus://start?minutes=45")!
    
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: notificationService)
    
    XCTAssertEqual(timerVM.totalSeconds, 2700)  // 45 * 60
    XCTAssertTrue(timerVM.isRunning)
}

@MainActor
func test_startURL_withoutMinutesParam_usesDefault() {
    let timerVM = TimerViewModel()
    let url = URL(string: "monofocus://start")!
    
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: nil)
    
    XCTAssertEqual(timerVM.totalSeconds, 1500)  // Default 25 minutes
    XCTAssertTrue(timerVM.isRunning)
}

@MainActor
func test_startURL_withInvalidMinutes_usesDefault() {
    let timerVM = TimerViewModel()
    let url = URL(string: "monofocus://start?minutes=abc")!
    
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: nil)
    
    XCTAssertEqual(timerVM.totalSeconds, 1500)  // Falls back to default
}
```

### **2. Stop Command**
```swift
@MainActor
func test_stopURL_stopsRunningTimer() {
    let timerVM = TimerViewModel()
    timerVM.start()
    let url = URL(string: "monofocus://stop")!
    
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: nil)
    
    XCTAssertFalse(timerVM.isRunning)
    XCTAssertEqual(timerVM.remainingSeconds, timerVM.totalSeconds)
}

@MainActor
func test_stopURL_whenNotRunning_doesNotCrash() {
    let timerVM = TimerViewModel()
    let url = URL(string: "monofocus://stop")!
    
    // Should handle gracefully
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: nil)
    
    XCTAssertFalse(timerVM.isRunning)
}
```

### **3. Invalid URLs**
```swift
@MainActor
func test_invalidScheme_ignored() {
    let timerVM = TimerViewModel()
    let url = URL(string: "https://example.com")!
    
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: nil)
    
    // Should do nothing
    XCTAssertFalse(timerVM.isRunning)
}

@MainActor
func test_unknownHost_ignored() {
    let timerVM = TimerViewModel()
    let url = URL(string: "monofocus://unknown")!
    
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: nil)
    
    // Should do nothing
    XCTAssertFalse(timerVM.isRunning)
}

@MainActor
func test_malformedURL_doesNotCrash() {
    let timerVM = TimerViewModel()
    let url = URL(string: "monofocus://start?minutes=")!
    
    // Should handle gracefully
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: nil)
    
    // Should use default minutes
    XCTAssertEqual(timerVM.totalSeconds, 1500)
}
```

### **4. Notification Service Integration**
```swift
@MainActor
func test_startURL_schedulesNotification() async {
    let timerVM = TimerViewModel()
    let notificationService = NotificationService()
    notificationService.permissionGranted = true
    
    let url = URL(string: "monofocus://start?minutes=1")!
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: notificationService)
    
    // Verify notification scheduled (requires inspection of pending notifications)
    XCTAssertTrue(timerVM.isRunning)
}
```

---

## 📋 Subtasks

- [ ] Wait for MONO-001 completion (URLRouter signature change)
- [ ] Create `Tests/URLRouterTests.swift`
- [ ] Add start command tests (3 tests)
- [ ] Add stop command tests (2 tests)
- [ ] Add invalid URL tests (3 tests)
- [ ] Add notification service integration test (1 test)
- [ ] Run tests and verify 100% coverage
- [ ] Add to CI/CD test suite

---

## 🧪 Running Tests

```bash
xcodebuild test \
  -project MonoFocus.xcodeproj \
  -scheme MonoFocus \
  -destination 'platform=iOS Simulator,name=iPhone 14' \
  -only-testing:MonoFocusTests/URLRouterTests
```

---

## 🔗 Related

- **Code Review:** Issue #1 (High Priority)
- **Dependencies:** MONO-001 (must complete first)
- **Files Changed:**
  - `Tests/URLRouterTests.swift` (new)

---

## ⚠️ Risks

- **Low Risk:** Simple URL parsing logic, easy to test
- **Blocker:** Requires MONO-001 to be merged first

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
