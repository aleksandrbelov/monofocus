# MONO-039: Heuristic Duration Suggestion Engine

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 4 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Implement a rule-based suggestion engine that recommends a focus duration using `SessionStats` from MONO-038. This ships before the Core ML model (MONO-041/042) and provides immediate value.

---

## 🎯 Acceptance Criteria

- [ ] Returns a single `Int` (minutes) from 1–180
- [ ] Requires ≥ 3 sessions before offering suggestions (shows nothing with sparse data)
- [ ] Rules applied in priority order:
  1. **Time of day:** If current hour matches `averageStartHour` ± 2, suggest the duration with highest completion rate at that hour
  2. **Streak boost:** If `currentStreak >= 5`, increase suggestion by 1 duration bucket (e.g. 25 → 45)
  3. **Completion rate:** Suggest the duration bucket with highest completion rate
  4. **Fallback:** Return 25 min
- [ ] Unit tests cover each rule branch (mocked `SessionStats`)

---

## 📋 Implementation Notes

- Logic lives in `SessionAnalyticsService.suggestedMinutes(stats:)` (MONO-038)
- MONO-040 (suggestion chip UI) calls this method
- MONO-042 replaces this method body with a Core ML inference call — same interface

---

## 🔗 Related

- MONO-038 (Analytics service — provides input `SessionStats`)
- MONO-040 (Suggestion chip UI — surfaces the result)
- MONO-042 (Core ML replacement — same API, smarter model)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 5
