# MONO-014: Refactor TimerViewModel

**Type:** Refactoring  
**Priority:** 🔵 Low (Post-MVP)  
**Status:** Backlog  
**Estimate:** 6 hours  
**Phase:** 3 (Optional Polish)

---

## 📝 Description

Extract responsibilities from `TimerViewModel` (currently 423 lines) into smaller, focused services to improve testability and reduce cognitive load.

**Current:** Monolithic ViewModel handling timer, persistence, background tasks, Live Activities, haptics  
**Target:** Clean ViewModel orchestrating focused services

---

## 🎯 Acceptance Criteria

- [ ] TimerViewModel reduced to <300 lines
- [ ] SessionRepository extracted and tested
- [ ] LiveActivityManager extracted (conditionally compiled)
- [ ] HapticsService extracted and reusable
- [ ] All existing tests still pass
- [ ] New services have 80%+ test coverage
- [ ] No behavioral regressions
- [ ] Performance unchanged

---

## 🔧 Refactoring Plan

### **Current Structure (423 lines)**

```
TimerViewModel
├── Timer logic (start, pause, resume, stop)
├── Clock synchronization
├── Background task scheduling
├── Live Activity updates
├── State persistence (JSON)
├── Session persistence (JSON)
├── Haptics
└── Formatted time strings
```

---

### **Target Structure**

```
TimerViewModel (250 lines)
├── Timer logic & state
└── Orchestrates dependencies

SessionRepository (80 lines)
├── Session persistence
├── State persistence
└── Session loading

LiveActivityManager (60 lines) [iOS 16.1+]
├── Activity creation
├── Activity updates
└── Activity cleanup

HapticsService (30 lines)
├── Feedback generators
└── Named haptic patterns
```

---

### **1. Extract SessionRepository**

```swift
// mobile/Services/SessionRepository.swift

import Foundation

/// Handles persistence of timer state and session history.
@MainActor
final class SessionRepository {
    private let storageURL: URL
    private let stateURL: URL
    
    init() {
        let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        storageURL = dir.appendingPathComponent("sessions.json")
        stateURL = dir.appendingPathComponent("timer-state.json")
    }
    
    // MARK: - State Persistence
    
    func saveState(
        totalSeconds: Int,
        remainingSeconds: Int,
        isRunning: Bool,
        isPaused: Bool,
        lastPreset: Int?,
        endDate: Date?,
        sessionStartDate: Date?
    ) {
        var state: [String: Any] = [
            "total": totalSeconds,
            "remaining": remainingSeconds,
            "running": isRunning,
            "paused": isPaused
        ]
        if let lastPreset { state["lastPreset"] = lastPreset }
        if let endDate { state["endDate"] = endDate.timeIntervalSince1970 }
        if let sessionStartDate { state["sessionStart"] = sessionStartDate.timeIntervalSince1970 }
        
        if let data = try? JSONSerialization.data(withJSONObject: state, options: []) {
            try? data.write(to: stateURL)
        }
    }
    
    func loadState() -> TimerState? {
        guard
            let data = try? Data(contentsOf: stateURL),
            let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
        else { return nil }
        
        return TimerState(
            totalSeconds: json["total"] as? Int ?? 1500,
            remainingSeconds: json["remaining"] as? Int ?? 1500,
            isRunning: json["running"] as? Bool ?? false,
            isPaused: json["paused"] as? Bool ?? false,
            lastPreset: json["lastPreset"] as? Int,
            endDate: (json["endDate"] as? Double).map { Date(timeIntervalSince1970: $0) },
            sessionStartDate: (json["sessionStart"] as? Double).map { Date(timeIntervalSince1970: $0) }
        )
    }
    
    // MARK: - Session Persistence
    
    func saveSession(_ session: FocusSession) {
        var sessions = loadSessions()
        sessions.append(session)
        if let data = try? JSONEncoder().encode(sessions) {
            try? data.write(to: storageURL)
        }
    }
    
    func loadSessions() -> [FocusSession] {
        guard let data = try? Data(contentsOf: storageURL) else { return [] }
        return (try? JSONDecoder().decode([FocusSession].self, from: data)) ?? []
    }
}

// MARK: - Supporting Types

struct TimerState {
    let totalSeconds: Int
    let remainingSeconds: Int
    let isRunning: Bool
    let isPaused: Bool
    let lastPreset: Int?
    let endDate: Date?
    let sessionStartDate: Date?
}
```

---

### **2. Extract LiveActivityManager**

```swift
// mobile/Services/LiveActivityManager.swift

#if canImport(ActivityKit)
import ActivityKit
import Foundation

@available(iOS 16.1, *)
@MainActor
final class LiveActivityManager {
    private var activityID: String?
    
    func updateActivity(
        totalSeconds: Int,
        remainingSeconds: Int,
        isPaused: Bool,
        isRunning: Bool,
        endDate: Date,
        presetLabel: String?
    ) {
        let attributes = TimerAttributes(
            totalSeconds: totalSeconds,
            presetLabel: presetLabel
        )
        let state = TimerAttributes.ContentState(
            remainingSeconds: max(remainingSeconds, 0),
            isPaused: isPaused,
            endDate: endDate
        )
        
        Task { @MainActor [state, attributes] in
            if let id = activityID,
               let currentActivity = Activity<TimerAttributes>.activities.first(where: { $0.id == id }) {
                if #available(iOS 16.2, *) {
                    await currentActivity.update(ActivityContent(state: state, staleDate: nil))
                } else {
                    await currentActivity.update(using: state)
                }
            } else if isRunning || isPaused {
                do {
                    let activity = try Activity<TimerAttributes>.request(
                        attributes: attributes,
                        contentState: state,
                        pushType: nil
                    )
                    activityID = activity.id
                } catch {
                    print("⚠️ [LiveActivityManager] Failed to start activity: \(error)")
                    activityID = nil
                }
            }
        }
    }
    
    func endActivity(dismissImmediately: Bool) {
        guard let id = activityID,
              let activity = Activity<TimerAttributes>.activities.first(where: { $0.id == id })
        else {
            activityID = nil
            return
        }
        
        activityID = nil
        Task {
            try? await activity.end(dismissalPolicy: dismissImmediately ? .immediate : .default)
        }
    }
}
#endif
```

---

### **3. Extract HapticsService**

```swift
// mobile/Services/HapticsService.swift

import UIKit

/// Provides named haptic feedback patterns for the MonoFocus experience.
enum HapticsService {
    static func selection() {
        UISelectionFeedbackGenerator().selectionChanged()
    }
    
    static func toggleOn() {
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred(intensity: 0.8)
    }
    
    static func toggleOff() {
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred(intensity: 0.5)
    }
    
    static func timerStart() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred(intensity: 0.9)
    }
    
    static func timerPause() {
        UIImpactFeedbackGenerator(style: .light).impactOccurred(intensity: 0.6)
    }
    
    static func timerResume() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred(intensity: 0.8)
    }
    
    static func timerStop() {
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred(intensity: 0.7)
    }
    
    static func timerComplete() {
        UINotificationFeedbackGenerator().notificationOccurred(.success)
    }
    
    static func error() {
        UINotificationFeedbackGenerator().notificationOccurred(.error)
    }
}
```

---

### **4. Updated TimerViewModel**

```swift
@MainActor
final class TimerViewModel: ObservableObject {
    @Published var totalSeconds: Int = 1500
    @Published var remainingSeconds: Int = 1500
    @Published var isRunning: Bool = false
    @Published var isPaused: Bool = false
    @Published var lastPreset: Int? = 25
    
    private var tickCancellable: AnyCancellable?
    private var sessionStartDate: Date?
    private var endDate: Date?
    
    private let repository: SessionRepository
    #if canImport(ActivityKit)
    @available(iOS 16.1, *)
    private lazy var liveActivityManager = LiveActivityManager()
    #endif
    
    init(repository: SessionRepository = SessionRepository()) {
        self.repository = repository
        restoreState()
    }
    
    // Timer methods now call:
    // - repository.saveState() instead of persistState()
    // - repository.saveSession() instead of persistSession()
    // - HapticsService.timerStart() instead of Haptics.timerStart()
    // - liveActivityManager.updateActivity() instead of updateLiveActivitySnapshot()
    
    // ... rest of timer logic
}
```

---

## 📋 Subtasks

- [ ] Create SessionRepository with tests (2h)
- [ ] Create LiveActivityManager (1h)
- [ ] Create HapticsService (30m)
- [ ] Refactor TimerViewModel to use services (2h)
- [ ] Update all tests to use new structure (1h)
- [ ] Performance regression testing (30m)
- [ ] Code review for clean separation
- [ ] Document new architecture in DESIGN_ARCHITECTURE.md

---

## 🧪 Testing Strategy

### **New Tests**
```swift
// Tests/SessionRepositoryTests.swift
@MainActor
func test_saveAndLoadState() { ... }

@MainActor
func test_saveSession_appendsToArray() { ... }
```

### **Existing Tests**
- All TimerViewModelTests should pass unchanged
- May need to inject mock repository for isolation

---

## 🔗 Related

- **Code Review:** Issue #5 (Medium Priority)
- **Files Created:**
  - `mobile/Services/SessionRepository.swift`
  - `mobile/Services/LiveActivityManager.swift`
  - `mobile/Services/HapticsService.swift`
  - `Tests/SessionRepositoryTests.swift`
- **Files Modified:**
  - `mobile/ViewModels/TimerViewModel.swift` (reduced)

---

## ⚠️ Risks

- **Medium Risk:** Large refactoring could introduce regressions
- **Mitigation:** Gate behind comprehensive test suite (MONO-003 to MONO-006)
- **Timeline:** Post-MVP (not blocking launch)

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead  
**Priority Note:** Only pursue if time permits after Phase 2
