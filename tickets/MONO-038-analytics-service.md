# MONO-038: Session Analytics Aggregation Service

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 3 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Create `SessionAnalyticsService` that aggregates historical `FocusSession` data into features used by the adaptive duration suggestion engine (MONO-039/042). Runs on-device; no network calls.

---

## 🎯 Acceptance Criteria

- [ ] Computes "completion rate by duration bucket" (< 30 min, 30–60 min, > 60 min)
- [ ] Computes "average session start hour" (time-of-day pattern)
- [ ] Computes "current streak" (consecutive days with ≥ 1 completed session)
- [ ] Computes "sessions in last 7 days" count
- [ ] All computations are pure functions (testable without side effects)
- [ ] Unit tests achieve 100 % line coverage for aggregation logic
- [ ] Expensive aggregations are cached until `sessions.json` changes

---

## 📋 Suggested API

```swift
struct SessionStats {
    var completionRateShort: Double   // < 30 min
    var completionRateMedium: Double  // 30–60 min
    var completionRateLong: Double    // > 60 min
    var averageStartHour: Double      // 0–23
    var currentStreak: Int
    var sessionsLastWeek: Int
}

@MainActor
final class SessionAnalyticsService: ObservableObject {
    func computeStats(from sessions: [FocusSession]) -> SessionStats
    func suggestedMinutes(stats: SessionStats) -> Int  // Used by MONO-039
}
```

---

## 🔗 Related

- MONO-039 (Heuristic suggestion engine — consumes `SessionStats`)
- MONO-041 (Core ML model — trained on aggregated features)
- `mobile/Models/FocusSession.swift`

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 5
