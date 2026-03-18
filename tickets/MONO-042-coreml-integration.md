# MONO-042: Replace Heuristic Engine with Core ML Model

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 4 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Swap the rule-based suggestion engine (MONO-039) with the trained Core ML model (MONO-041). The external API (`suggestedMinutes(stats:)`) remains unchanged; only the implementation changes.

---

## 🎯 Acceptance Criteria

- [ ] `SessionAnalyticsService.suggestedMinutes(stats:)` now loads and queries the bundled `.mlmodelc`
- [ ] Falls back to heuristic rules if model file is missing or prediction throws
- [ ] Feature values match the schema in MONO-041
- [ ] All existing tests for heuristic engine still pass (model is additive, not breaking)
- [ ] New test: ML inference returns a value in `[25, 45, 90]`

---

## 📋 Implementation Sketch

```swift
func suggestedMinutes(stats: SessionStats) -> Int {
    guard let model = try? FocusDurationPredictor(configuration: MLModelConfiguration()),
          let prediction = try? model.prediction(
              hourOfDay: stats.averageStartHour,
              dayOfWeek: Double(Calendar.current.component(.weekday, from: Date()) - 1),
              completionRateShort: stats.completionRateShort,
              completionRateMedium: stats.completionRateMedium,
              completionRateLong: stats.completionRateLong,
              currentStreak: Double(stats.currentStreak)
          )
    else {
        return heuristicSuggestion(stats: stats)  // Fallback
    }
    return Int(prediction.durationMinutes)
}
```

---

## 🔗 Related

- MONO-039 (Heuristic fallback — kept in place)
- MONO-041 (Model file — must be complete first)
- MONO-040 (Suggestion chip UI — no changes needed)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 5
