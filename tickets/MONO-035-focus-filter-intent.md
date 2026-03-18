# MONO-035: SetFocusFilterIntent

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 3 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Register a `SetFocusFilterIntent` so the app appears in iOS Focus settings and can automatically configure itself (e.g. start a specific preset) when the user activates a Focus mode.

---

## 🎯 Acceptance Criteria

- [ ] `MonoFocusFocusFilter` struct conforms to `SetFocusFilterIntent`
- [ ] Configurable parameter: `preset` (`TimerPreset` entity, optional)
- [ ] When Focus activates with this filter: if `preset` is set, auto-start that preset
- [ ] When Focus deactivates: if timer was started by the filter, stop it
- [ ] Filter appears in iOS Settings → Focus → [Focus Mode] → Apps → MonoFocus
- [ ] Unit test: filter intent activates and starts correct preset

---

## 📋 Implementation Notes

```swift
struct MonoFocusFocusFilter: SetFocusFilterIntent {
    static var title: LocalizedStringResource = "Start Focus Timer"
    static var description = IntentDescription("Automatically start a MonoFocus timer when this Focus is active.")

    @Parameter(title: "Preset") var preset: TimerPreset?

    func perform() async throws -> some IntentResult {
        if let preset {
            await AppDependencyContainer.shared.timerVM.setPreset(minutes: preset.minutes)
            await AppDependencyContainer.shared.timerVM.start()
        }
        return .result()
    }
}
```

- Requires `NSFocusStatusUsageDescription` in `Info.plist`
- Requires `com.apple.developer.focus-status` entitlement

---

## 🔗 Related

- MONO-020 (TimerPreset AppEntity — required before this)
- MONO-023 (TimerPresetQuery — needed for parameter resolution)
- MONO-036 (Focus Filter settings UI)
- MONO-037 (Auto-start on focus activation)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 5
