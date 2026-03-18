# MONO-020: Custom Preset Data Model & Persistence

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Introduce a `TimerPreset` model that lets users store custom timer durations alongside the built-in 25/45/90 min presets. Presets are persisted in the shared App Group container so widgets can read them.

---

## 🎯 Acceptance Criteria

- [ ] `TimerPreset` struct is `Codable`, `Identifiable`, and `Equatable`
- [ ] `PresetStore` service reads/writes `presets.json` from the shared container
- [ ] Default presets (25, 45, 90 min) are seeded on first launch
- [ ] Presets survive app restart (round-trip encode/decode test)
- [ ] `WidgetDataManager` exposes presets to widget timeline providers

---

## 🗂️ Data Model

```swift
struct TimerPreset: Codable, Identifiable, Equatable {
    var id: UUID
    var label: String        // e.g. "Deep Work"
    var minutes: Int         // 1–180
    var emoji: String?       // Optional icon, e.g. "🎯"
    var isBuiltIn: Bool      // Built-in presets cannot be deleted
}
```

**Storage:** `group.dev.monofocus.data/presets.json` (JSON array, ordered).

---

## 📋 Implementation Notes

- Add `PresetStore` to `mobile/Services/`
- Inject via `AppDependencyContainer`
- Publish `@Published var presets: [TimerPreset]` for SwiftUI bindings
- Default presets use fixed UUIDs so they are stable across installs

---

## 🔗 Related

- MONO-021 (Preset editor UI — depends on this model)
- MONO-022 (Widget sync — reads from same JSON)
- MONO-023 (Siri phrases update — uses preset labels)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
