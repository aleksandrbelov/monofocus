# MONO-007: Device Testing Matrix

**Type:** QA/Testing  
**Priority:** 🔴 Critical  
**Status:** Ready for Execution  
**Estimate:** 4 hours  
**Phase:** 1 (Critical Path)

---

## 📝 Description

Execute comprehensive device testing across target iOS devices to validate timer functionality, animations, accessibility, and performance before TestFlight release.

**Devices:** iPhone SE (3rd gen), iPhone 14 Pro, iPhone 14 Pro Max

---

## 🎯 Acceptance Criteria

- [ ] All core timer functions work on 3 device types
- [ ] Animations smooth (60 FPS) on all devices
- [ ] VoiceOver navigation verified on all devices
- [ ] Dynamic Type tested on all devices
- [ ] Lock Screen widgets functional on all devices
- [ ] No crashes during 30-minute stress test
- [ ] Battery impact <2% per hour on iPhone 14 Pro
- [ ] Memory usage <50MB baseline on all devices

---

## 📱 Device Matrix

| Device | iOS | Screen Size | Notes |
|--------|-----|-------------|-------|
| iPhone SE (3rd gen) | 16.0+ | 4.7" | Min spec, small screen |
| iPhone 14 Pro | 17.0+ | 6.1" | Dynamic Island, ProMotion |
| iPhone 14 Pro Max | 17.0+ | 6.7" | Large screen edge cases |

---

## 🧪 Test Scenarios

### **1. Core Timer Functions (30 min per device)**
- [ ] Start 25m preset → verify countdown
- [ ] Pause timer → verify state
- [ ] Resume timer → verify continues correctly
- [ ] Stop timer → verify resets
- [ ] Complete full session → verify notification fires
- [ ] Background/foreground transition during timer
- [ ] Force quit app while running → verify restoration

### **2. Lock Screen Widgets (15 min per device)**
- [ ] Add widget to Lock Screen
- [ ] Tap 25m preset in widget → verify timer starts
- [ ] Tap 45m preset in widget → verify timer starts
- [ ] Tap 90m preset in widget → verify timer starts
- [ ] Deep link from widget schedules notification

### **3. Animations & Performance (20 min per device)**
- [ ] Circular progress ring animates smoothly
- [ ] Modal transitions smooth (no jank)
- [ ] Button press animations responsive
- [ ] Scroll performance smooth (if applicable)
- [ ] Record FPS using Xcode Instruments
- [ ] Verify 60 FPS (120 FPS on ProMotion)

### **4. Accessibility (30 min per device)**
- [ ] Enable VoiceOver → navigate entire app
- [ ] Enable Reduce Motion → verify animations disabled
- [ ] Test Dynamic Type (XS to XXXL)
- [ ] Test color contrast in both themes
- [ ] Verify focus order logical
- [ ] Test with VoiceOver + Reduce Motion combined

### **5. Edge Cases (20 min per device)**
- [ ] Start timer with 1 minute → verify completes
- [ ] Start timer with 180 minutes → verify countdown
- [ ] Interrupt with phone call → verify timer continues
- [ ] Low battery mode → verify timer still works
- [ ] Airplane mode → verify offline functionality
- [ ] Storage full → verify graceful degradation

---

## 📊 Performance Benchmarks

### **Launch Time**
- Target: <2 seconds cold start
- Measure: Xcode Instruments (Time Profiler)

### **Memory Usage**
- Baseline: <50MB idle
- Peak: <75MB during timer
- Measure: Xcode Instruments (Allocations)

### **Battery Impact**
- Target: <2% drain per hour
- Measure: Battery section in Settings → Last 24 Hours

### **Frame Rate**
- Target: 60 FPS sustained (120 FPS on ProMotion)
- Measure: Xcode Debug → Show FPS gauge

---

## 📋 Test Execution Checklist

### **Pre-Flight**
- [ ] Build release configuration: `xcodebuild -configuration Release`
- [ ] Install on all 3 devices
- [ ] Clear app data on all devices
- [ ] Charge devices to 100%

### **Per Device**
- [ ] Run core timer scenarios (30 min)
- [ ] Test Lock Screen widgets (15 min)
- [ ] Measure animations & FPS (20 min)
- [ ] Test accessibility features (30 min)
- [ ] Run edge case scenarios (20 min)
- [ ] 30-minute stress test (run multiple timers back-to-back)
- [ ] Record battery usage after 1 hour

### **Post-Flight**
- [ ] Compile results in test report
- [ ] Screenshot any visual issues
- [ ] File bugs for P0/P1 issues
- [ ] Sign off on device compatibility

---

## 🐛 Bug Reporting Template

```markdown
**Device:** iPhone 14 Pro, iOS 17.0
**Steps:**
1. Start 25m timer
2. Lock device
3. Wait 5 minutes
4. Unlock device

**Expected:** Timer shows 20:00 remaining
**Actual:** Timer shows 25:00 (did not count down)
**Priority:** P0
**Screenshots:** [attach]
```

---

## 📸 Required Screenshots

For each device:
- [ ] Timer idle state
- [ ] Timer running state
- [ ] Timer paused state
- [ ] Completion modal
- [ ] Lock Screen widget (all 3 presets)
- [ ] Accessibility inspector view

---

## 🔗 Related

- **Code Review:** Testing requirement
- **Testing Plan:** Sections 1, 4, 5
- **Dependencies:** MONO-001, MONO-002 (should be fixed first)

---

## ⚠️ Risks

- **Device Availability:** Ensure physical access to all 3 device types
- **Time Estimate:** May take longer if critical bugs found
- **Blocking:** Any P0 bugs will block TestFlight release

---

**Created:** November 5, 2025  
**Assignee:** QA Engineer  
**Reviewer:** Product Owner
