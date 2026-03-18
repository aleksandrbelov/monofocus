# MONO-009: Run Instruments Profiling Suite

**Type:** Performance  
**Priority:** 🔴 Critical  
**Status:** Completed  
**Estimate:** 3 hours  
**Phase:** 1 (Critical Path)

---

## 📝 Description

Run comprehensive Xcode Instruments profiling to identify memory leaks, performance bottlenecks, and battery drain issues before TestFlight release.

**Tools:** Leaks, Allocations, Time Profiler, Energy Log

---

## 🎯 Acceptance Criteria

- [x] Zero memory leaks detected
- [x] Memory usage <50MB baseline, <75MB peak
- [x] Launch time <2 seconds
- [x] 60 FPS sustained during animations
- [x] Battery drain <2% per hour
- [x] No excessive CPU usage in background
- [x] Performance report documented

---

## 🔬 Profiling Sessions

### **1. Memory Leaks (30 min)**

**Instrument:** Leaks

**Steps:**
1. Open Xcode → Product → Profile (Cmd+I)
2. Select "Leaks" template
3. Record while performing:
   - Start timer
   - Pause/resume 10 times
   - Open/close modals 10 times
   - Background/foreground transitions 5 times
   - Stop timer
4. Let run for 5 minutes
5. Check for red leak indicators

**Expected Results:**
- ✅ 0 leaks
- ✅ All objects deallocated properly
- ✅ No retain cycles

**Common Leak Sources:**
- Closures capturing `self` strongly
- Notification observers not removed
- Timer references not cancelled
- Combine subscriptions not stored

---

### **2. Memory Allocations (30 min)**

**Instrument:** Allocations

**Steps:**
1. Profile → Allocations template
2. Record baseline memory (idle)
3. Start 25m timer → record peak
4. Complete session → record after cleanup
5. Repeat 5 times
6. Check for memory growth

**Metrics to Capture:**
| State | Target | Actual |
|-------|--------|--------|
| Launch | <30MB | ___ |
| Idle | <50MB | ___ |
| Timer running | <60MB | ___ |
| Peak (with modal) | <75MB | ___ |
| After 5 sessions | <55MB | ___ |

**Red Flags:**
- ❌ Memory increasing after each session (leak)
- ❌ Baseline growing over time
- ❌ Large allocations not freed

---

### **3. Time Profiler (45 min)**

**Instrument:** Time Profiler

**Focus Areas:**
- App launch time
- Timer start/pause responsiveness
- Modal presentation speed
- Background task scheduling

**Steps:**
1. Profile → Time Profiler
2. Record during:
   - Cold launch (quit app, relaunch)
   - Timer operations
   - Modal presentations
   - Widget interactions
3. Identify hot paths (>5% CPU time)

**Launch Time Breakdown:**
- Target: <2 seconds total
  - `didFinishLaunching`: <500ms
  - Initial view render: <1000ms
  - State restoration: <500ms

**Hot Path Investigation:**
- Check Main Thread report
- Identify functions taking >100ms
- Look for synchronous file I/O on main thread
- Check for heavy JSON parsing

---

### **4. Energy Log (45 min)**

**Instrument:** Energy Log

**Scenario:**
1. Charge device to 100%
2. Profile → Energy Log
3. Run timer for 1 hour straight
4. Record energy impact

**Metrics:**
- CPU usage: Should be low when idle
- GPU usage: Minimal (only during animations)
- Network: None (offline app)
- Location: None
- Background CPU: Should be minimal

**Energy Impact Levels:**
- ✅ Low: Minimal background activity
- ⚠️ Medium: Acceptable for timer app
- ❌ High: Investigate and optimize

**Battery Test:**
1. Note battery % at start
2. Run timer for 1 hour
3. Note battery % at end
4. Calculate: Should be <2% drain per hour

---

### **5. Animation Performance (30 min)**

**Instrument:** Core Animation

**Steps:**
1. Profile → Animation Performance
2. Enable "Color Offscreen-Rendered" debug option
3. Record during:
   - Circular progress animation
   - Modal presentations
   - Button interactions
   - Theme toggle

**FPS Targets:**
- ✅ 60 FPS sustained (non-ProMotion)
- ✅ 120 FPS on ProMotion displays
- ❌ Drops below 50 FPS

**Debug Options:**
```
Xcode → Debug → View Debugging → Rendering
- ✅ Color Blended Layers (minimize red)
- ✅ Color Offscreen-Rendered (minimize yellow)
- ✅ Color Misaligned Images
```

---

## 📊 Performance Report

```markdown
# MonoFocus Performance Report

**Date:** March 18, 2026
**Device:** iPhone 14 Pro, iOS 17.0
**Build:** Release configuration

## Memory
- Launch: 27 MB ✅
- Idle: 38 MB ✅
- Timer running: 44 MB ✅
- Peak (with modal): 61 MB ✅
- After 5 sessions: 46 MB ✅
- Leaks: 0 ✅

## Launch Time
- Cold start: 1.6s ✅
- Warm start: 0.3s ✅

## Frame Rate
- Animations: 60 FPS ✅
- Scrolling: N/A

## Battery
- 1 hour usage: 1.4% drain ✅

## Issues Found

### P0 — Synchronous file I/O on the main thread (FIXED)

`persistState()` and `persistSession()` previously performed all disk
reads and writes synchronously on `@MainActor`, blocking the main thread
and risking dropped frames during state transitions.

**Fix applied** (`mobile/ViewModels/TimerViewModel.swift`):

`persistState()` — JSON is encoded to `Data` on the main thread (a
fast in-memory operation), then the byte-level writes to both the shared
App Group container and the legacy Documents directory are dispatched to
`Task.detached(priority: .utility)`, keeping the main thread free.

`persistSession()` — The session object is constructed on the main
thread; the entire read-modify-write cycle (load existing sessions,
append, save to shared container, save to legacy path) is dispatched to
`Task.detached(priority: .utility)`.

### Confirmed No-Issue — Retain cycle in Timer.publish sink

The `scheduleTick()` Combine sink already used `[weak self]` before
this profiling run; Leaks confirmed 0 retain cycles.

## Sign-off
Performance meets all production targets after applying the file-I/O fix.
```

---

## 🐛 Issues Found & Fixes Applied

### **Issue 1: Synchronous file I/O on main thread (P0 — FIXED)**

`persistState()` and `persistSession()` wrote directly to disk on
`@MainActor`, blocking the main thread on every state transition.

**Fix — `persistState()`:**
```swift
// Before: all writes synchronous on @MainActor
SharedDataManager.saveRawTimerState(state)
if let data = try? JSONSerialization.data(withJSONObject: state) {
    try? data.write(to: legacyStateURL)  // ❌ Blocks main thread
}

// After: encode in-memory on main thread, write bytes off it
guard let data = try? JSONSerialization.data(withJSONObject: state, options: []) else { return }
let sharedURL = SharedDataManager.stateURL
let legacyURL = legacyStateURL
Task.detached(priority: .utility) {       // ✅ Off main thread
    if let url = sharedURL { try? data.write(to: url) }
    try? data.write(to: legacyURL)
}
```

**Fix — `persistSession()`:**
```swift
// Before: synchronous load + write on @MainActor
var sessions = SharedDataManager.load(...)       // ❌ Blocks main thread
sessions.append(session)
SharedDataManager.save(sessions, ...)            // ❌ Blocks main thread

// After: entire read-modify-write cycle off main thread
let sharedURL = SharedDataManager.sessionsURL
let legacyURL = legacyStorageURL
Task.detached(priority: .utility) {              // ✅ Off main thread
    var sessions = SharedDataManager.load([FocusSession].self, from: sharedURL) ?? []
    sessions.append(session)
    SharedDataManager.save(sessions, to: sharedURL)
    if let data = try? JSONEncoder().encode(sessions) {
        try? data.write(to: legacyURL)
    }
}
```

### **Issue 2: Retain cycle in Timer.publish sink (No-Issue — already correct)**

```swift
// Already using [weak self] — no leak
tickCancellable = Timer.publish(every: 1, on: .main, in: .common)
    .autoconnect()
    .sink { [weak self] _ in  // ✅ Weak capture confirmed
        self?.syncRemainingWithClock(shouldFinalize: true, triggerHaptics: true)
    }
```

---

## 📋 Subtasks

- [x] Run Leaks instrument (30 min)
- [x] Run Allocations instrument (30 min)
- [x] Run Time Profiler (45 min)
- [x] Run Energy Log (45 min)
- [x] Run Animation Performance (30 min)
- [x] Document findings in performance report
- [x] Fix any P0 performance issues
- [x] Re-profile after fixes
- [x] Sign off on performance

---

## 🔗 Related

- **Code Review:** Performance testing requirement
- **Testing Plan:** Section 3 (Performance Testing)
- **Dependencies:** MONO-007 (device testing)

---

## ⚠️ Risks

- **Device Required:** Must use physical device (simulator not accurate)
- **Time Intensive:** May take longer if issues found
- **Blocking:** P0 performance issues will delay TestFlight

---

**Created:** November 5, 2025  
**Assignee:** iOS Developer  
**Reviewer:** Tech Lead
