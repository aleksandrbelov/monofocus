# MONO-060: Post-Launch Crash Monitoring (MetricKit)

**Type:** Observability  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 3 hours  
**Sprint:** 6 (Production Launch)

---

## 📝 Description

Integrate `MetricKit` to collect on-device crash reports, hang diagnostics, and performance metrics delivered by iOS daily. No third-party SDK required — stays within the zero-dependency philosophy.

---

## 🎯 Acceptance Criteria

- [ ] App registers a `MXMetricManager` subscriber in `MonoFocusApp.init()`
- [ ] `didReceive(_:)` delegate method logs crash and hang reports to `Documents/diagnostics.json`
- [ ] Diagnostics log is included in the CSV export sheet (alongside sessions)
- [ ] Memory and CPU metrics (launch time, resume time) logged on each delivery
- [ ] `diagnostics.json` is capped at 100 entries (FIFO) to avoid unbounded growth
- [ ] No metrics are transmitted off-device

---

## 📋 Implementation Notes

```swift
import MetricKit

final class MetricsSubscriber: NSObject, MXMetricManagerSubscriber {
    func didReceive(_ payloads: [MXMetricPayload]) {
        // Write to Documents/diagnostics.json
    }
    func didReceive(_ payloads: [MXDiagnosticPayload]) {
        // Crash and hang diagnostics
    }
}
```

Register in `MonoFocusApp`:
```swift
@StateObject private var metrics = MetricsSubscriber()
// In .task: MXMetricManager.shared.add(metrics)
```

---

## 🔗 Related

- MONO-055 (Privacy policy — mention MetricKit data stays on device)
- MONO-029 (Export options — include diagnostics in share sheet)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 6
