# MONO-006: Add Persistence Layer Tests

**Type:** Testing  
**Priority:** 🟡 High  
**Status:** Ready for Development  
**Estimate:** 3 hours  
**Phase:** 2 (Quality Improvements)

---

## 📝 Description

Create comprehensive tests for session persistence, state restoration, and JSON encoding/decoding logic in `TimerViewModel`.

**Current Coverage:** 0% (persistence logic untested)  
**Target Coverage:** 90%+

---

## 🎯 Acceptance Criteria

- [ ] Session persistence tested (save & load)
- [ ] State restoration tested (app relaunch)
- [ ] JSON encoding/decoding validated
- [ ] Edge cases covered (corrupted JSON, missing files)
- [ ] File system operations tested
- [ ] All tests pass in CI/CD

---

## 🔧 Test Cases to Implement

### **1. Session Persistence**
```swift
@MainActor
func test_persistSession_completedSession_saves() {
    let vm = TimerViewModel()
    vm.setPreset(minutes: 25)
    vm.start()
    
    // Simulate completion
    vm.stop(save: true)
    
    let sessions = vm.loadSessions()
    XCTAssertEqual(sessions.count, 1)
    XCTAssertEqual(sessions[0].durationSeconds, 0)  // Stopped immediately
    XCTAssertFalse(sessions[0].completed)
}

@MainActor
func test_persistSession_multipleSessionsAccumulate() {
    let vm = TimerViewModel()
    
    // Session 1
    vm.setPreset(minutes: 25)
    vm.start()
    vm.stop(save: true)
    
    // Session 2
    vm.setPreset(minutes: 45)
    vm.start()
    vm.stop(save: true)
    
    let sessions = vm.loadSessions()
    XCTAssertEqual(sessions.count, 2)
}

@MainActor
func test_loadSessions_whenNoFile_returnsEmpty() {
    // Create fresh VM with non-existent storage
    let vm = TimerViewModel()
    
    // Delete sessions file if exists
    let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let storageURL = dir.appendingPathComponent("sessions.json")
    try? FileManager.default.removeItem(at: storageURL)
    
    let sessions = vm.loadSessions()
    XCTAssertEqual(sessions.count, 0)
}
```

### **2. State Restoration**
```swift
@MainActor
func test_stateRestoration_idleTimer() {
    let vm1 = TimerViewModel()
    vm1.setPreset(minutes: 30)
    vm1.persistState()
    
    // Simulate app relaunch
    let vm2 = TimerViewModel()
    XCTAssertEqual(vm2.totalSeconds, 1800)
    XCTAssertEqual(vm2.remainingSeconds, 1800)
    XCTAssertFalse(vm2.isRunning)
}

@MainActor
func test_stateRestoration_runningTimer_syncsClock() async {
    let vm1 = TimerViewModel()
    vm1.setPreset(minutes: 5)
    vm1.start()
    vm1.persistState()
    
    // Simulate 2 seconds passing
    try? await Task.sleep(for: .seconds(2))
    
    // Simulate app relaunch
    let vm2 = TimerViewModel()
    
    await MainActor.run {
        XCTAssertTrue(vm2.isRunning)
        XCTAssertLessThan(vm2.remainingSeconds, 300)  // Some time elapsed
    }
}

@MainActor
func test_stateRestoration_pausedTimer() {
    let vm1 = TimerViewModel()
    vm1.setPreset(minutes: 10)
    vm1.start()
    vm1.pause()
    vm1.persistState()
    
    let vm2 = TimerViewModel()
    XCTAssertFalse(vm2.isRunning)
    XCTAssertTrue(vm2.isPaused)
    XCTAssertEqual(vm2.remainingSeconds, 600)  // Preserved
}
```

### **3. JSON Handling**
```swift
@MainActor
func test_corruptedStateJSON_fallsBackToDefault() {
    let vm = TimerViewModel()
    
    // Write corrupted JSON
    let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let stateURL = dir.appendingPathComponent("timer-state.json")
    try? "invalid json {".write(to: stateURL, atomically: true, encoding: .utf8)
    
    // Should not crash and use defaults
    let vm2 = TimerViewModel()
    XCTAssertEqual(vm2.totalSeconds, 1500)  // Default 25 minutes
}

@MainActor
func test_corruptedSessionsJSON_returnsEmpty() {
    let vm = TimerViewModel()
    
    // Write corrupted JSON
    let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let storageURL = dir.appendingPathComponent("sessions.json")
    try? "[invalid]".write(to: storageURL, atomically: true, encoding: .utf8)
    
    let sessions = vm.loadSessions()
    XCTAssertEqual(sessions.count, 0)  // Graceful fallback
}
```

### **4. FocusSession Model**
```swift
func test_focusSession_encodesAndDecodes() throws {
    let session = FocusSession(
        id: UUID(),
        start: Date(),
        durationSeconds: 1500,
        presetLabel: "25m",
        completed: true
    )
    
    let data = try JSONEncoder().encode(session)
    let decoded = try JSONDecoder().decode(FocusSession.self, from: data)
    
    XCTAssertEqual(decoded.id, session.id)
    XCTAssertEqual(decoded.durationSeconds, 1500)
    XCTAssertEqual(decoded.presetLabel, "25m")
    XCTAssertTrue(decoded.completed)
}

func test_focusSession_withoutPresetLabel() throws {
    let session = FocusSession(
        id: UUID(),
        start: Date(),
        durationSeconds: 3600,
        presetLabel: nil,
        completed: false
    )
    
    let data = try JSONEncoder().encode(session)
    let decoded = try JSONDecoder().decode(FocusSession.self, from: data)
    
    XCTAssertNil(decoded.presetLabel)
}
```

---

## 📋 Subtasks

- [ ] Create `Tests/PersistenceTests.swift`
- [ ] Add session persistence tests (3 tests)
- [ ] Add state restoration tests (3 tests)
- [ ] Add JSON handling tests (2 tests)
- [ ] Add FocusSession model tests (2 tests)
- [ ] Test file system edge cases (permissions, disk full)
- [ ] Run coverage report
- [ ] Clean up test files in teardown

---

## 🧪 Test Setup & Teardown

```swift
final class PersistenceTests: XCTestCase {
    var testDirectory: URL!
    
    override func setUp() async throws {
        // Use temporary directory for tests
        testDirectory = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
        try FileManager.default.createDirectory(at: testDirectory, withIntermediateDirectories: true)
    }
    
    override func tearDown() async throws {
        // Clean up test files
        try? FileManager.default.removeItem(at: testDirectory)
    }
}
```

---

## 🔗 Related

- **Code Review:** Issue #1 (High Priority)
- **Files Changed:**
  - `Tests/PersistenceTests.swift` (new)
- **Dependencies:** MONO-003 (similar testing patterns)

---

## ⚠️ Risks

- **File System Access:** Tests may fail if sandboxing prevents file operations
- **Timing:** State restoration tests with running timers may be flaky

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
