# MONO-002: Add Error Logging to Silent Failures

**Type:** Improvement  
**Priority:** 🔴 Critical  
**Status:** Ready for Development  
**Estimate:** 2 hours  
**Phase:** 1 (Critical Path)

---

## 📝 Description

Multiple error handlers silently swallow exceptions without logging, making debugging difficult in production and TestFlight. Add lightweight logging to identify edge cases and failure modes.

**Impact:** Improves observability and reduces time to diagnose issues in production.

---

## 🎯 Acceptance Criteria

- [ ] All `try?` and empty `catch` blocks have logging
- [ ] Logs include context (function name, parameters)
- [ ] Logs use consistent format across codebase
- [ ] No sensitive data logged (PII, device identifiers)
- [ ] Logs are only printed in Debug builds (optional in Release)

---

## 🔧 Technical Details

### **Locations to Fix**

#### **1. NotificationService.swift:33**
```swift
// BEFORE
do {
    try await UNUserNotificationCenter.current().add(req)
} catch {
    // ignore for MVP  ❌
}

// AFTER
do {
    try await UNUserNotificationCenter.current().add(req)
} catch {
    print("⚠️ [NotificationService] Failed to schedule notification: \(error.localizedDescription)")
    // Still optional—timer works without notifications
}
```

#### **2. TimerViewModel.swift:330**
```swift
// BEFORE
try? BGTaskScheduler.shared.submit(request)  ❌

// AFTER
do {
    try BGTaskScheduler.shared.submit(request)
} catch {
    print("⚠️ [TimerViewModel] Failed to schedule background task: \(error)")
    // Background task is optional—timer still works in foreground
}
```

#### **3. ShortcutService.swift:64**
```swift
// BEFORE
guard let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
      let url = URL(string: "shortcuts://run-shortcut?name=\(encoded)") else {
    return  ❌
}

// AFTER
guard let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
      let url = URL(string: "shortcuts://run-shortcut?name=\(encoded)") else {
    print("⚠️ [ShortcutService] Invalid shortcut name: '\(name)'")
    return
}
```

#### **4. TimerViewModel.swift:354 (JSON persistence)**
```swift
// BEFORE
if let data = try? JSONEncoder().encode(arr) {
    try? data.write(to: storageURL)
}

// AFTER
do {
    let data = try JSONEncoder().encode(arr)
    try data.write(to: storageURL)
} catch {
    print("⚠️ [TimerViewModel] Failed to persist session: \(error)")
    // Session lost but app continues
}
```

---

## 🧪 Testing Instructions

### **Verification Steps**
1. Build in Debug mode
2. Trigger each error condition:
   - Deny notification permission → check logs
   - Background task submission during app termination → check logs
   - Invalid shortcut name → check logs
   - Corrupt JSON file → check logs
3. Verify no sensitive data appears in logs
4. Build in Release mode
5. Verify logs still appear (or use `#if DEBUG` if preferred)

### **Force Error Conditions**
```swift
// Test notification failure
await notificationService.scheduleEndOfSessionNotification(inSeconds: -1)  // Invalid trigger

// Test background task failure
// Requires device testing—background tasks fail on simulator

// Test shortcut URL encoding
shortcuts.runShortcut(named: "Invalid/Name|With\\Special*Chars")

// Test JSON corruption
// Manually edit timer-state.json with invalid JSON
```

---

## 📋 Subtasks

- [ ] Audit all `try?` usages in codebase
- [ ] Audit all empty `catch` blocks
- [ ] Add logging to NotificationService
- [ ] Add logging to TimerViewModel (persistence)
- [ ] Add logging to TimerViewModel (background tasks)
- [ ] Add logging to ShortcutService
- [ ] Test each error path manually
- [ ] Code review for sensitive data in logs

---

## 🎨 Logging Standards

### **Format**
```
⚠️ [ClassName] Brief description: <error>
```

### **Examples**
```swift
print("⚠️ [TimerViewModel] Failed to decode state: \(error)")
print("⚠️ [NotificationService] Permission denied: \(status)")
print("⚠️ [ShortcutService] URL encoding failed for: '\(name)'")
```

### **Sensitive Data to Avoid**
- ❌ User IDs, email addresses
- ❌ Device identifiers (UDID)
- ❌ Full file paths (use last component only)
- ✅ Error descriptions, function names, enum values

---

## 🔗 Related

- **Code Review:** Issue #2 (High Priority)
- **Files Changed:**
  - `mobile/ViewModels/TimerViewModel.swift`
  - `mobile/Services/NotificationService.swift`
  - `mobile/Services/ShortcutService.swift`

---

## ⚠️ Risks

- **Low Risk:** Non-invasive changes, no behavior modifications
- **Privacy Risk:** Mitigated by avoiding PII in logs

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
