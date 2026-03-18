# MONO-023: Update AppShortcuts Phrases for Custom Presets

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 1 hour  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Extend `TimerShortcuts.swift` so Siri can refer to user-created preset labels (e.g. "Start a Deep Work timer in MonoFocus") in addition to minute-based invocations.

---

## 🎯 Acceptance Criteria

- [ ] `StartTimerIntent` parameter `minutes` accepts an `IntentParameter` linked to `TimerPreset`
- [ ] Siri phrase template added: "Start a \(.presetLabel) timer in MonoFocus"
- [ ] Custom preset names appear in Shortcuts app parameter picker
- [ ] Fallback phrase still works: "Start a \(.minutes) minute timer in MonoFocus"

---

## 📋 Implementation Notes

- Conform `TimerPreset` to `AppEntity` so it can be used as an `IntentParameter`
- Add `TimerPresetQuery` conforming to `EntityQuery` for Siri disambiguation
- Update `AppShortcuts` `phrases` array in `TimerShortcuts.swift`

---

## 🔗 Related

- MONO-020 (Preset model)
- [`mobile/AppIntents/StartTimerIntent.swift`](../../mobile/AppIntents/StartTimerIntent.swift)
- [`mobile/AppIntents/TimerShortcuts.swift`](../../mobile/AppIntents/TimerShortcuts.swift)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
