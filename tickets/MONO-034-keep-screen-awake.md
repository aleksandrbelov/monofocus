# MONO-034: Keep Screen Awake During Session Toggle

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 1 hour  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Add a toggle in Settings → Timer that disables screen auto-lock while a focus session is running via `UIApplication.shared.isIdleTimerDisabled`.

---

## 🎯 Acceptance Criteria

- [ ] Toggle "Keep Screen On" in Settings → Timer section (default: off)
- [ ] Setting persisted with `@AppStorage("keepScreenAwake")`
- [ ] When enabled, `TimerViewModel.start()` sets `UIApplication.shared.isIdleTimerDisabled = true`
- [ ] When session stops/pauses/completes, `isIdleTimerDisabled` resets to `false`
- [ ] When app goes to background, `isIdleTimerDisabled` is set to `false` regardless of setting
- [ ] Setting is read and respected on app restore if timer was previously running

---

## 📋 Implementation Notes

- Add `applyScreenWakeSetting()` helper to `TimerViewModel`
- Call from `start()`, `pause()`, `stop()`, and in `scenePhase` `.background` handler

---

## 🔗 Related

- MONO-030 (Settings view)
- `mobile/ViewModels/TimerViewModel.swift`
- `mobile/MonoFocusApp.swift` (scene phase handler)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
