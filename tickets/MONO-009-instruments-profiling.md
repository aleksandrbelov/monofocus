# MONO-009: Run Instruments Profiling Suite

**Type:** Performance  
**Priority:** 🔴 Critical  
**Status:** Ready for Execution  
**Estimate:** 3 hours  
**Phase:** 1 (Critical Path)

---

## 📝 Description

Run comprehensive Xcode Instruments profiling to identify memory leaks, performance bottlenecks, and battery drain issues before TestFlight release.

**Tools:** Leaks, Allocations, Time Profiler, Energy Log

---

## 🎯 Acceptance Criteria

- [ ] Zero memory leaks detected
- [ ] Memory usage <50MB baseline, <75MB peak
- [ ] Launch time <2 seconds
- [ ] 60 FPS sustained during animations
- [ ] Battery drain <2% per hour
- [ ] No excessive CPU usage in background
- [ ] Performance report documented

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

## 📊 Performance Report Template

```markdown
# MonoFocus Performance Report

**Date:** November X, 2025
**Device:** iPhone 14 Pro, iOS 17.0
**Build:** Release configuration

## Memory
- Launch: 28 MB ✅
- Idle: 42 MB ✅
- Peak: 68 MB ✅
- Leaks: 0 ✅

## Launch Time
- Cold start: 1.8s ✅
- Warm start: 0.4s ✅

## Frame Rate
- Animations: 60 FPS ✅
- Scrolling: N/A

## Battery
- 1 hour usage: 1.5% drain ✅

## Issues Found
- None

## Sign-off
Performance meets production standards.
```

---

## 🐛 Common Issues & Solutions

### **Issue: Memory leak in TimerViewModel**
```swift
// Bad: Retain cycle
Timer.publish(every: 1, on: .main, in: .common)
    .sink { [self] _ in  // ❌ Captures self strongly
        self.tick()
    }

// Good: Weak capture
Timer.publish(every: 1, on: .main, in: .common)
    .sink { [weak self] _ in  // ✅
        self?.tick()
    }
```

### **Issue: Synchronous file I/O on main thread**
```swift
// Bad: Blocking main thread
func persistState() {
    let data = try? JSONEncoder().encode(state)
    try? data?.write(to: stateURL)  // ❌ Synchronous
}

// Better: Already using synchronous but fast operations
// For larger files, use async:
func persistState() async {
    let data = try? JSONEncoder().encode(state)
    try? await data?.write(to: stateURL)
}
```

---

## 📋 Subtasks

- [ ] Run Leaks instrument (30 min)
- [ ] Run Allocations instrument (30 min)
- [ ] Run Time Profiler (45 min)
- [ ] Run Energy Log (45 min)
- [ ] Run Animation Performance (30 min)
- [ ] Document findings in performance report
- [ ] Fix any P0 performance issues
- [ ] Re-profile after fixes
- [ ] Sign off on performance

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
