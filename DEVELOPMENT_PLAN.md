# MonoFocus — Development Plan

**Updated:** March 2026  
**Current Phase:** Sprint 2 (Testing & Stabilization)  
**Architecture:** SwiftUI + WidgetKit + AppIntents, iOS 18+, zero dependencies

---

## 🗺️ Product Vision

MonoFocus is a minimal, offline-first iOS focus timer with first-class system integration. Every sprint moves toward a single goal: **make it trivially easy to start a focused session and get out of the user's way**.

---

## 📊 Current State (Post-Sprint 2)

| Area | Status | Coverage |
|------|--------|----------|
| Core timer (start/pause/resume/stop) | ✅ Complete | – |
| Background execution (BGProcessingTask) | ✅ Complete | Needs device test |
| Live Activities (Lock Screen + Dynamic Island) | ✅ Complete | Needs device test |
| AppIntents — 4 user intents + 4 automation intents | ✅ Complete | Needs device test |
| Static WidgetKit widgets (small/medium/large) | ✅ Complete | Needs device test |
| Session history + CSV export | ✅ Complete | Needs validation |
| Design system (tokens, components, theming) | ✅ Complete | – |
| Automation / Shortcuts donation | ✅ Complete | Needs device test |
| Unit & integration tests | ⚠️ Minimal | ~5 % |
| CI/CD pipeline | ❌ Missing | – |
| Accessibility audit | ❌ Missing | – |
| Settings UI | ❌ Missing | – |

---

## 🏃 Sprint 2 — Stabilisation & TestFlight (current)

**Goal:** Validate all Sprint-1/2 features on real hardware and ship a TestFlight build.  
**Duration:** 2 weeks  
**Exit criteria:** Zero P0 bugs, tested on 3 devices, TestFlight build approved.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-001 | Fix URLRouter notification-service bug | 🔴 Critical | 1 h |
| MONO-002 | Add error logging to all silent failures | 🔴 Critical | 2 h |
| MONO-007 | Device-testing matrix (SE 3, 14 Pro, 14 Pro Max) | 🔴 Critical | 4 h |
| MONO-008 | VoiceOver full-navigation audit | 🔴 Critical | 2 h |
| MONO-009 | Instruments profiling (memory, FPS, battery) | 🔴 Critical | 3 h |
| MONO-016 | Ship TestFlight beta build | 🟡 High | 3 d |

---

## 🏃 Sprint 3 — Quality & Developer Experience

**Goal:** Raise test coverage to ≥ 60 %, set up CI/CD, and eliminate known code-quality issues.  
**Duration:** 2 weeks  
**Entry criteria:** Sprint 2 exit criteria met.  
**Exit criteria:** CI green on every PR, 60 %+ coverage, zero SwiftLint warnings.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-003 | TimerViewModel unit tests | 🟡 High | 4 h |
| MONO-004 | NotificationService tests | 🟡 High | 2 h |
| MONO-005 | URLRouter tests | 🟡 High | 1 h |
| MONO-006 | Persistence layer tests | 🟡 High | 3 h |
| MONO-010 | Extract magic strings to constants | 🟡 High | 2 h |
| MONO-012 | GitHub Actions CI/CD pipeline | 🟢 Medium | 3 h |
| MONO-013 | Widget URL type-safety | 🟢 Medium | 1 h |
| MONO-018 | AppIntent integration tests | 🟢 Medium | 3 h |
| MONO-019 | SwiftLint configuration & zero-violation pass | 🟢 Medium | 2 h |

**New tickets to create:** MONO-018, MONO-019 (see `tickets/` directory).

---

## 🏃 Sprint 4 — User Experience Enhancements

**Goal:** Add the most-requested UX features: session history UI, custom presets, and settings.  
**Duration:** 3 weeks  
**Entry criteria:** Sprint 3 exit criteria met.  
**Exit criteria:** All new screens pass VoiceOver audit; no regressions in existing tests.

### 4.1 Custom Presets
Allow users to configure their own timer durations (1–180 min) instead of the fixed 25/45/90 preset buttons.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-020 | Custom preset data model & persistence | 🟡 High | 2 h |
| MONO-021 | Preset editor UI (add / edit / delete / reorder) | 🟡 High | 4 h |
| MONO-022 | Sync custom presets to WidgetKit timeline | 🟡 High | 2 h |
| MONO-023 | Update AppShortcuts phrases for custom presets | 🟢 Medium | 1 h |

### 4.2 Session History UI
Replace the CSV-only export with an in-app history screen showing session streaks, daily totals, and a weekly bar chart.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-024 | Session history list view (grouped by day) | 🟡 High | 4 h |
| MONO-025 | Weekly focus-time bar chart | 🟡 High | 3 h |
| MONO-026 | Session detail view (preset, duration, completion) | 🟢 Medium | 2 h |
| MONO-027 | History filtering (date range, completed-only) | 🟢 Medium | 2 h |
| MONO-028 | Batch delete sessions | 🟢 Medium | 1 h |
| MONO-029 | Export options (CSV + plain-text share sheet) | 🟢 Medium | 2 h |

### 4.3 Settings Panel
Provide a Settings screen accessible from the main view for haptic, notification, and appearance preferences.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-030 | Settings view scaffold (NavigationStack sheet) | 🟡 High | 2 h |
| MONO-031 | Haptic feedback toggle & intensity slider | 🟡 High | 2 h |
| MONO-032 | Notification sound picker (system sounds) | 🟢 Medium | 2 h |
| MONO-033 | App icon variants (light, dark, tinted) | 🟢 Medium | 3 h |
| MONO-034 | "Keep screen awake during session" toggle | 🟢 Medium | 1 h |

---

## 🏃 Sprint 5 — System Integration & Intelligence

**Goal:** Deeper OS integration and first on-device intelligence features.  
**Duration:** 3 weeks  
**Entry criteria:** Sprint 4 exit criteria met.  
**Exit criteria:** Focus Filter adopted by 80 %+ beta testers; ML accuracy ≥ 70 % on holdout sessions.

### 5.1 iOS Focus Filter Integration
Register a `FocusFilterIntent` so users can enable MonoFocus automatically when a Focus mode (Work, Personal, etc.) is active.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-035 | `SetFocusFilterIntent` with preset parameter | 🟡 High | 3 h |
| MONO-036 | Focus Filter configuration UI in Settings | 🟡 High | 2 h |
| MONO-037 | Start timer automatically when Focus activates | 🟡 High | 2 h |

### 5.2 Adaptive Duration Suggestions
Use on-device Core ML to suggest focus durations based on historical session completion rates, time of day, and session streaks.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-038 | Session analytics aggregation service | 🟡 High | 3 h |
| MONO-039 | Heuristic suggestion engine (no ML model yet) | 🟡 High | 4 h |
| MONO-040 | Suggestion chip UI on main timer screen | 🟡 High | 2 h |
| MONO-041 | Core ML model training pipeline (CreateML) | 🟢 Medium | 8 h |
| MONO-042 | Replace heuristic engine with Core ML model | 🟢 Medium | 4 h |

### 5.3 iCloud Session Sync
Sync `sessions.json` via CloudKit so history is available across a user's iPhone, iPad, and Mac (Catalyst).

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-043 | CloudKit container setup & capability | 🟡 High | 2 h |
| MONO-044 | Conflict-resolution strategy for session records | 🟡 High | 4 h |
| MONO-045 | CloudKit sync service (async, background) | 🟡 High | 6 h |
| MONO-046 | Sync status indicator in History view | 🟢 Medium | 1 h |
| MONO-047 | Privacy disclosure (CloudKit data in Privacy Policy) | 🟢 Medium | 1 h |

### 5.4 Apple Watch Companion
Provide a watchOS app so users can start, pause, and see remaining time from their wrist.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-048 | watchOS target in project.yml + XcodeGen | 🟡 High | 2 h |
| MONO-049 | Watch timer UI (large digit, complication) | 🟡 High | 6 h |
| MONO-050 | WatchConnectivity session state sync | 🟡 High | 4 h |
| MONO-051 | Taptic Engine feedback on watch | 🟢 Medium | 1 h |
| MONO-052 | Watch complication family support | 🟢 Medium | 3 h |

---

## 🏃 Sprint 6 — Production Launch

**Goal:** Ship MonoFocus 1.0 on the App Store.  
**Duration:** 2 weeks  
**Entry criteria:** All P0/P1 items from Sprints 2–5 resolved; TestFlight NPS ≥ 8.  
**Exit criteria:** App Store review approved; launch announced.

| Ticket | Task | Priority | Est. |
|--------|------|----------|------|
| MONO-053 | App Store screenshots (all supported devices) | 🔴 Critical | 4 h |
| MONO-054 | App Store description, keywords, category | 🔴 Critical | 2 h |
| MONO-055 | Privacy policy page (hosted, GDPR-compliant) | 🔴 Critical | 2 h |
| MONO-056 | App Review compliance checklist | 🔴 Critical | 1 h |
| MONO-057 | Support email & response SLA documented | 🟡 High | 1 h |
| MONO-058 | Release notes (v1.0 changelog) | 🟡 High | 1 h |
| MONO-059 | Rollback plan (pull from sale procedure) | 🟡 High | 1 h |
| MONO-060 | Post-launch crash monitoring (MetricKit) | 🟡 High | 3 h |
| MONO-061 | App Store Connect analytics baseline | 🟢 Medium | 1 h |

---

## 📅 High-Level Timeline

```
2026 Q1
 Sprint 2  (wks 1–2)   Stabilisation, device testing, TestFlight
 Sprint 3  (wks 3–4)   Testing, CI/CD, code quality
2026 Q2
 Sprint 4  (wks 5–7)   Custom presets, history UI, settings
 Sprint 5  (wks 8–10)  Focus Filter, ML suggestions, iCloud, Watch
 Sprint 6  (wks 11–12) App Store launch
```

---

## 🎯 Prioritisation Framework

Features are prioritised on three axes:

| Score | Impact | Effort | Risk |
|-------|--------|--------|------|
| 🔴 Critical | Blocks release | < 2 h | Breaks existing features |
| 🟡 High | Core UX improvement | 2–8 h | Isolated new surface |
| 🟢 Medium | Nice to have | > 8 h | Requires new OS capability |
| 🔵 Low | Backlog | Any | Speculative / exploratory |

---

## 📏 Definition of Done (all sprints)

- [ ] Feature is code-reviewed and merged to `main`
- [ ] New code covered by unit tests where applicable
- [ ] No compiler warnings introduced
- [ ] SwiftLint clean
- [ ] CI pipeline passes
- [ ] New screens pass VoiceOver navigation test
- [ ] `DEVELOPMENT_PLAN.md` and `TODO.md` updated

---

## 🚨 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Background timer drifts > 1 s | Medium | High | Use `startDate + elapsed` clock anchor instead of tick counting |
| Live Activity API changes in iOS 18.x | Low | Medium | Wrap in availability checks, pin to stable APIs |
| CloudKit conflicts on multi-device | Medium | Medium | Last-write-wins with server timestamp; soft-delete only |
| Core ML model size > 5 MB | Low | Low | Use CreateML tabular regressor; typical size < 500 KB |
| App Store rejection (DND Shortcut URL) | Medium | High | Replace `shortcuts://` with AppIntents for all automation |
| Watch target increases build time 30 % | Low | Low | Add Watch target to CI only after simulator tests pass |

---

## 🔗 Related Documents

- [`TODO.md`](./TODO.md) — Sprint-by-sprint checklist
- [`tickets/IMPLEMENTATION_PLAN.md`](./tickets/IMPLEMENTATION_PLAN.md) — Phase 1–3 execution detail
- [`tickets/`](./tickets/) — Individual ticket files (MONO-001 … MONO-061)
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — System design
- [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md) — Service & ViewModel API reference
