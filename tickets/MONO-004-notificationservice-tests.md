# MONO-004: Add NotificationService Unit Tests

**Type:** Testing  
**Priority:** 🟡 High  
**Status:** Ready for Development  
**Estimate:** 2 hours  
**Phase:** 2 (Quality Improvements)

---

## 📝 Description

Create comprehensive test coverage for `NotificationService` to verify permission handling and notification scheduling logic.

**Current Coverage:** 0% (no tests)  
**Target Coverage:** 85%+

---

## 🎯 Acceptance Criteria

- [ ] Minimum 5 test cases covering notification service
- [ ] Permission request flow tested
- [ ] Notification scheduling tested
- [ ] Edge cases covered (denied permission, invalid intervals)
- [ ] All tests pass in CI/CD

---

## 🔧 Test Cases to Implement

### **1. Permission Handling**
```swift
@MainActor
func test_requestAuthorization_whenNotDetermined_requestsPermission() async {
    let service = NotificationService()
    
    // Note: Requires mocking UNUserNotificationCenter for true unit testing
    // For now, test behavior in integration tests
    await service.requestAuthorizationIfNeeded()
    
    // Cannot assert on permissionGranted without mocking
    // This test validates no crashes occur
}

@MainActor
func test_requestAuthorization_whenAlreadyGranted_doesNotRequestAgain() async {
    let service = NotificationService()
    
    // First request
    await service.requestAuthorizationIfNeeded()
    let firstValue = service.permissionGranted
    
    // Second request (should be no-op)
    await service.requestAuthorizationIfNeeded()
    let secondValue = service.permissionGranted
    
    XCTAssertEqual(firstValue, secondValue)
}
```

### **2. Notification Scheduling**
```swift
@MainActor
func test_scheduleNotification_whenPermissionDenied_doesNothing() async {
    let service = NotificationService()
    service.permissionGranted = false
    
    // Should complete without error
    await service.scheduleEndOfSessionNotification(inSeconds: 60)
    
    // Verify notification not scheduled (requires UNUserNotificationCenter inspection)
}

@MainActor
func test_scheduleNotification_withValidInterval_schedules() async {
    let service = NotificationService()
    
    // Simulate permission granted
    service.permissionGranted = true
    
    await service.scheduleEndOfSessionNotification(inSeconds: 120)
    
    // In real implementation, inspect pending notifications:
    // let center = UNUserNotificationCenter.current()
    // let requests = await center.pendingNotificationRequests()
    // XCTAssertTrue(requests.contains(where: { $0.identifier == "end-of-session" }))
}
```

### **3. Edge Cases**
```swift
@MainActor
func test_scheduleNotification_withZeroInterval_usesMinimum() async {
    let service = NotificationService()
    service.permissionGranted = true
    
    // Should clamp to minimum 1 second
    await service.scheduleEndOfSessionNotification(inSeconds: 0)
    
    // Verify trigger interval is at least 1 second
}

@MainActor
func test_scheduleNotification_withNegativeInterval_usesMinimum() async {
    let service = NotificationService()
    service.permissionGranted = true
    
    await service.scheduleEndOfSessionNotification(inSeconds: -10)
    
    // Should not crash and should use minimum interval
}
```

---

## 🧪 Testing Strategy

### **Option 1: Integration Tests (Recommended for MVP)**
Test actual notification behavior on simulator/device:
```swift
func test_endToEnd_notificationFiresAfterDelay() async {
    let service = NotificationService()
    await service.requestAuthorizationIfNeeded()
    await service.scheduleEndOfSessionNotification(inSeconds: 2)
    
    try? await Task.sleep(for: .seconds(3))
    
    // Manually verify notification appeared (requires manual observation)
}
```

### **Option 2: Mock-Based Tests (Better long-term)**
Create `MockNotificationCenter` protocol:
```swift
protocol NotificationCenterProtocol {
    func requestAuthorization(options: UNAuthorizationOptions) async throws -> Bool
    func add(_ request: UNNotificationRequest) async throws
    func pendingNotificationRequests() async -> [UNNotificationRequest]
}

// Refactor NotificationService to accept protocol injection
// Then test with mock implementation
```

---

## 📋 Subtasks

- [ ] Create `Tests/NotificationServiceTests.swift`
- [ ] Add permission request tests (2 tests)
- [ ] Add scheduling tests (2 tests)
- [ ] Add edge case tests (2 tests)
- [ ] Document testing limitations (mocking needed for full coverage)
- [ ] Run tests and verify no crashes
- [ ] Optional: Create mock notification center for better isolation

---

## 🔗 Related

- **Code Review:** Issue #1 (High Priority)
- **Files Changed:**
  - `Tests/NotificationServiceTests.swift` (new)
- **Dependencies:** MONO-003 (similar testing patterns)

---

## ⚠️ Risks

- **Mocking Complexity:** UNUserNotificationCenter is difficult to mock without protocol abstraction
- **Async Testing:** Requires proper async/await test patterns

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
