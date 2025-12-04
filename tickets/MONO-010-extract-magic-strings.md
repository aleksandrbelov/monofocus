# MONO-010: Extract Magic Strings to Constants

**Type:** Code Quality  
**Priority:** 🟡 High  
**Status:** Ready for Development  
**Estimate:** 2 hours  
**Phase:** 2 (Quality Improvements)

---

## 📝 Description

Extract hardcoded string literals to named constants to improve maintainability, reduce typos, and enable easier refactoring.

**Impact:** Improves code quality and reduces risk of bugs from typos.

---

## 🎯 Acceptance Criteria

- [ ] All notification identifiers extracted to constants
- [ ] All UserDefaults keys extracted to enums
- [ ] All background task identifiers extracted to constants
- [ ] All URL scheme strings extracted to constants
- [ ] No magic strings remaining in service layers
- [ ] Code review confirms consistency

---

## 🔧 Refactoring Plan

### **1. NotificationService.swift**

**Current:**
```swift
let req = UNNotificationRequest(identifier: "end-of-session", content: content, trigger: trigger)
```

**Refactored:**
```swift
private enum Constants {
    static let endOfSessionNotificationID = "end-of-session"
}

let req = UNNotificationRequest(
    identifier: Constants.endOfSessionNotificationID,
    content: content,
    trigger: trigger
)

// Also update removal:
UNUserNotificationCenter.current().removePendingNotificationRequests(
    withIdentifiers: [Constants.endOfSessionNotificationID]
)
```

---

### **2. TimerViewModel.swift**

**Current:**
```swift
static let backgroundTaskIdentifier = "dev.monofocus.app.timer-processing"

UNUserNotificationCenter.current().removePendingNotificationRequests(
    withIdentifiers: ["end-of-session"]
)
```

**Refactored:**
```swift
private enum Constants {
    static let backgroundTaskIdentifier = "dev.monofocus.app.timer-processing"
    static let endOfSessionNotificationID = "end-of-session"
    static let storageFileName = "sessions.json"
    static let stateFileName = "timer-state.json"
}

// Update usages:
static let backgroundTaskIdentifier = Constants.backgroundTaskIdentifier

UNUserNotificationCenter.current().removePendingNotificationRequests(
    withIdentifiers: [Constants.endOfSessionNotificationID]
)

storageURL = dir.appendingPathComponent(Constants.storageFileName)
stateURL = dir.appendingPathComponent(Constants.stateFileName)
```

---

### **3. ShortcutService.swift**

**Current:**
```swift
private enum Keys {
    static let dndShortcutName = "dndShortcutName"
    static let grayscaleShortcutName = "grayscaleShortcutName"
    static let dndOffShortcutName = "dndOffShortcutName"
    static let grayscaleOffShortcutName = "grayscaleOffShortcutName"
    static let dndAutomationEnabled = "dndAutomationEnabled"
    static let grayscaleAutomationEnabled = "grayscaleAutomationEnabled"
    static let pendingDisableDND = "pendingDisableDND"
    static let pendingDisableGrayscale = "pendingDisableGrayscale"
}
```

**Status:** ✅ Already well-structured! Just need to extract URL scheme:

```swift
private enum Constants {
    static let shortcutURLScheme = "shortcuts://run-shortcut"
}

func runShortcut(named name: String) {
    guard !name.isEmpty else { return }
    guard let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
          let url = URL(string: "\(Constants.shortcutURLScheme)?name=\(encoded)") else {
        print("⚠️ [ShortcutService] Invalid shortcut name: '\(name)'")
        return
    }
    UIApplication.shared.open(url)
}
```

---

### **4. URLRouter.swift**

**Current:**
```swift
guard url.scheme == "monofocus" else { return }
if url.host == "start", let comps = URLComponents(url: url, resolvingAgainstBaseURL: false) {
    let minutes = comps.queryItems?.first(where: { $0.name == "minutes" })?.value.flatMap { Int($0) } ?? 25
    // ...
} else if url.host == "stop" {
    // ...
}
```

**Refactored:**
```swift
enum URLRouter {
    private enum Constants {
        static let appScheme = "monofocus"
        static let startHost = "start"
        static let stopHost = "stop"
        static let minutesQueryParam = "minutes"
        static let defaultMinutes = 25
    }
    
    @MainActor
    static func handle(url: URL, timerVM: TimerViewModel, notificationService: NotificationService?) {
        guard url.scheme == Constants.appScheme else { return }
        
        if url.host == Constants.startHost,
           let comps = URLComponents(url: url, resolvingAgainstBaseURL: false) {
            let minutes = comps.queryItems?
                .first(where: { $0.name == Constants.minutesQueryParam })?
                .value
                .flatMap { Int($0) } ?? Constants.defaultMinutes
            timerVM.setPreset(minutes: minutes)
            timerVM.start(notificationService: notificationService)
        } else if url.host == Constants.stopHost {
            timerVM.stop(save: true)
        }
    }
}
```

---

### **5. MonoFocusWidgets.swift**

**Current:**
```swift
Link("25", destination: URL(string: "monofocus://start?minutes=25")!)
Link("45", destination: URL(string: "monofocus://start?minutes=45")!)
Link("90", destination: URL(string: "monofocus://start?minutes=90")!)
```

**Refactored:**
```swift
private extension URL {
    private enum Constants {
        static let scheme = "monofocus"
        static let startHost = "start"
        static let minutesParam = "minutes"
    }
    
    static func monoFocusStart(minutes: Int) -> URL {
        var components = URLComponents()
        components.scheme = Constants.scheme
        components.host = Constants.startHost
        components.queryItems = [
            URLQueryItem(name: Constants.minutesParam, value: "\(minutes)")
        ]
        return components.url!
    }
}

// Usage:
Link("25", destination: .monoFocusStart(minutes: 25))
Link("45", destination: .monoFocusStart(minutes: 45))
Link("90", destination: .monoFocusStart(minutes: 90))
```

---

### **6. Notification Names**

**Current:**
```swift
extension Notification.Name {
    static let timerSessionCompleted = Notification.Name("TimerSessionCompleted")
}
```

**Status:** ✅ Already well-structured!

Optional improvement:
```swift
extension Notification.Name {
    private enum Constants {
        static let timerSessionCompletedKey = "TimerSessionCompleted"
    }
    
    static let timerSessionCompleted = Notification.Name(Constants.timerSessionCompletedKey)
}
```

---

## 📋 Subtasks

- [ ] Extract NotificationService constants
- [ ] Extract TimerViewModel constants
- [ ] Extract ShortcutService URL scheme
- [ ] Extract URLRouter constants
- [ ] Refactor widget URL construction
- [ ] Search codebase for remaining magic strings
- [ ] Update tests to use constants where applicable
- [ ] Code review for consistency
- [ ] Verify no regressions

---

## 🔍 Search for Magic Strings

```bash
# Find hardcoded strings in Swift files
cd /Users/oleksandrbielov/dev/MonoFocus-Dev-Starter/MonoFocus
grep -r '"[a-z-].*"' mobile --include="*.swift" | \
  grep -v "// " | \
  grep -v "print" | \
  grep -v "accessibilityLabel" | \
  grep -v "accessibilityHint"
```

---

## 🧪 Testing

### **Verification Steps**
1. Build project (no compiler errors)
2. Run all unit tests (all pass)
3. Manual test:
   - Start timer via URL scheme
   - Start timer via widget
   - Complete session → notification fires
4. Verify no behavioral changes

---

## 🔗 Related

- **Code Review:** Issue #3 (High Priority)
- **Files Changed:**
  - `mobile/Services/NotificationService.swift`
  - `mobile/ViewModels/TimerViewModel.swift`
  - `mobile/Services/ShortcutService.swift`
  - `mobile/Utils/URLRouter.swift`
  - `mobile/MonoFocusWidgets/MonoFocusWidgets.swift`

---

## ⚠️ Risks

- **Low Risk:** Mechanical refactoring, no logic changes
- **Testing:** Thorough testing required to catch any missed strings

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
