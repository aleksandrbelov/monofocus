# TODO / Roadmap

> Full sprint details and new-feature specs live in [`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md).

---

## ✅ Sprint 1 — MVP (Complete)
- [x] Core timer: start / pause / resume / stop
- [x] Local end-of-session notifications
- [x] Three built-in presets (25 / 45 / 90 min)
- [x] Deep-link URL scheme (`monofocus://start?minutes=N`)
- [x] Static Lock Screen & Home Screen widgets
- [x] Shortcuts automation UI (x-callback-url)

---

## 🔄 Sprint 2 — Stabilisation & TestFlight (in progress)

### Implemented — needs device validation
- [x] Timer background execution (BGProcessingTask + clock anchor)
- [x] Live Activity on Lock Screen & Dynamic Island
- [x] AppIntents for Siri & Shortcuts (4 user + 4 automation intents)
- [x] Session history CSV export

### Remaining tasks
- [ ] MONO-001 Fix URLRouter notification-service bug
- [ ] MONO-002 Add error logging to silent failures
- [ ] MONO-007 Device testing matrix (SE 3, iPhone 14 Pro, 14 Pro Max)
- [ ] MONO-008 VoiceOver full-navigation audit
- [ ] MONO-009 Instruments profiling (memory, FPS, battery)
- [ ] MONO-016 Ship TestFlight beta build
- [ ] Update `.github/copilot-instructions.md` with Sprint 2 patterns

---

## 📋 Sprint 3 — Quality & Developer Experience
- [ ] MONO-003 TimerViewModel unit tests
- [ ] MONO-004 NotificationService tests
- [ ] MONO-005 URLRouter tests
- [ ] MONO-006 Persistence layer tests
- [ ] MONO-010 Extract magic strings to constants
- [ ] MONO-012 GitHub Actions CI/CD pipeline
- [ ] MONO-013 Widget URL type-safety
- [ ] MONO-018 AppIntent integration tests
- [ ] MONO-019 SwiftLint configuration & zero-violation pass

---

## 📋 Sprint 4 — User Experience Enhancements
- [ ] MONO-020–023 Custom preset editor (model, UI, widget sync, Siri phrases)
- [ ] MONO-024–029 Session history UI (list, chart, filtering, export)
- [ ] MONO-030–034 Settings panel (haptics, notification sound, app icon, screen awake)

---

## 📋 Sprint 5 — System Integration & Intelligence
- [ ] MONO-035–037 iOS Focus Filter integration
- [ ] MONO-038–042 Adaptive duration suggestions (heuristic → Core ML)
- [ ] MONO-043–047 iCloud session sync via CloudKit
- [ ] MONO-048–052 Apple Watch companion app

---

## 📋 Sprint 6 — Production Launch
- [ ] MONO-053–054 App Store screenshots, description, keywords
- [ ] MONO-055–056 Privacy policy & review compliance
- [ ] MONO-057–059 Support, release notes, rollback plan
- [ ] MONO-060–061 MetricKit crash monitoring & analytics baseline
