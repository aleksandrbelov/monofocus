# MONO-040: Adaptive Suggestion Chip UI

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Show a "Suggested: 45 min" chip above the preset buttons on the main timer screen when the suggestion engine has a confident recommendation.

---

## 🎯 Acceptance Criteria

- [ ] Chip appears only when `SessionAnalyticsService` returns a suggestion (≥ 3 sessions)
- [ ] Chip text: "Suggested: N min" with a subtle sparkle or wand SF Symbol
- [ ] Tapping the chip sets the timer to the suggested duration (same as tapping a preset button)
- [ ] Chip animates in with `.transition(.move(edge: .top).combined(with: .opacity))`
- [ ] Chip does not appear if the user has already selected a preset this session
- [ ] VoiceOver: "Suggested duration: N minutes. Tap to select."
- [ ] Chip style follows `Pill` button style from existing design system

---

## 🔗 Related

- MONO-039 (Suggestion engine — provides the value)
- MONO-042 (Core ML upgrade — same UI, smarter input)
- `mobile/Views/TimerView.swift`

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 5
