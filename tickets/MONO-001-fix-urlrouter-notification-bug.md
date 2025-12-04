# MONO-001: Fix URLRouter Notification Service Bug

**Type:** Bug  
**Priority:** 🔴 Critical  
**Status:** Ready for Development  
**Estimate:** 1 hour  
**Phase:** 1 (Critical Path)

---

## 📝 Description

`URLRouter.handle()` calls `timerVM.start()` without passing `notificationService`, causing end-of-session notifications to not schedule when timers are started via deep links or widgets.

**Impact:** Users starting timers from Lock Screen widgets or Shortcuts won't receive completion notifications.

---

## 🎯 Acceptance Criteria

- [ ] `URLRouter.handle()` accepts `notificationService` parameter
- [ ] Deep link timer starts schedule notifications correctly
- [ ] Widget taps schedule notifications correctly
- [ ] Manual testing confirms notification fires after widget-started timer
- [ ] No regression in existing timer start flows

---

## 🔧 Technical Details

### **Current Code (Broken)**
```swift
// URLRouter.swift:10
@MainActor
static func handle(url: URL, timerVM: TimerViewModel) {
    guard url.scheme == "monofocus" else { return }
    if url.host == "start", let comps = URLComponents(url: url, resolvingAgainstBaseURL: false) {
        let minutes = comps.queryItems?.first(where: { $0.name == "minutes" })?.value.flatMap { Int($0) } ?? 25
        timerVM.setPreset(minutes: minutes)
        timerVM.start()  // ❌ Missing notificationService
    } else if url.host == "stop" {
        timerVM.stop(save: true)
    }
}
```

### **Fixed Code**
```swift
// URLRouter.swift
@MainActor
static func handle(url: URL, timerVM: TimerViewModel, notificationService: NotificationService?) {
    guard url.scheme == "monofocus" else { return }
    if url.host == "start", let comps = URLComponents(url: url, resolvingAgainstBaseURL: false) {
        let minutes = comps.queryItems?.first(where: { $0.name == "minutes" })?.value.flatMap { Int($0) } ?? 25
        timerVM.setPreset(minutes: minutes)
        timerVM.start(notificationService: notificationService)  // ✅ Pass service
    } else if url.host == "stop" {
        timerVM.stop(save: true)
    }
}
```

### **Call Site Update**
```swift
// MonoFocusApp.swift:48
.onOpenURL { url in
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: notificationService)
}
```

---

## 🧪 Testing Instructions

### **Manual Test**
1. Build app to device
2. Add MonoFocus widget to Lock Screen
3. Tap "25m" preset in widget
4. Wait 25 minutes
5. **Expected:** Notification appears saying "Session complete"

### **Unit Test**
```swift
@MainActor
func test_deepLinkStartSchedulesNotification() async {
    let timerVM = TimerViewModel()
    let notificationService = NotificationService()
    await notificationService.requestAuthorizationIfNeeded()
    
    let url = URL(string: "monofocus://start?minutes=1")!
    URLRouter.handle(url: url, timerVM: timerVM, notificationService: notificationService)
    
    // Verify notification was scheduled (requires notification mock)
    XCTAssertTrue(timerVM.isRunning)
}
```

---

## 📋 Subtasks

- [ ] Update `URLRouter.handle()` signature
- [ ] Update call site in `MonoFocusApp.swift`
- [ ] Manual test with Lock Screen widget
- [ ] Manual test with deep link from Safari
- [ ] Verify notification fires after 1-minute test timer
- [ ] Update any documentation referencing URLRouter

---

## 🔗 Related

- **Code Review:** Issue #4 (High Priority)
- **Files Changed:** 
  - `mobile/Utils/URLRouter.swift`
  - `mobile/MonoFocusApp.swift`

---

## ⚠️ Risks

- **Low Risk:** Simple parameter addition, no complex logic changes
- **Regression Risk:** Minimal—only adds functionality, doesn't change existing behavior

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
