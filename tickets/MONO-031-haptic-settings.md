# MONO-031: Haptic Feedback Toggle & Intensity Slider

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Let users disable haptic feedback entirely, or choose between three intensity levels (Light, Medium, Heavy). Setting is persisted via `@AppStorage` and respected by the `Haptics` enum.

---

## 🎯 Acceptance Criteria

- [ ] Toggle "Enable Haptics" in Settings → Timer section (default: on)
- [ ] When enabled, a segmented control appears: "Light", "Medium", "Heavy"
- [ ] Default intensity: "Medium"
- [ ] `Haptics` enum reads `UserDefaults` before firing a generator
- [ ] Toggling off → all `Haptics.*()` calls become no-ops
- [ ] Setting change takes effect immediately (no restart required)

---

## 📋 Implementation Notes

```swift
// Extend Haptics enum in TimerViewModel.swift
enum HapticIntensity: String, CaseIterable {
    case light, medium, heavy
}

extension Haptics {
    static var isEnabled: Bool {
        UserDefaults.standard.object(forKey: "hapticsEnabled") as? Bool ?? true
    }
    static var intensity: HapticIntensity {
        HapticIntensity(rawValue: UserDefaults.standard.string(forKey: "hapticsIntensity") ?? "medium") ?? .medium
    }
}
```

---

## 🔗 Related

- MONO-030 (Settings view scaffold)
- `mobile/ViewModels/TimerViewModel.swift` — `Haptics` enum at bottom of file

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
