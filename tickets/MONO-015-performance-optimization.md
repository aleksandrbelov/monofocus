# MONO-015: Performance Optimization Pass

**Type:** Performance  
**Priority:** 🔵 Low (Post-MVP)  
**Status:** Backlog  
**Estimate:** 4 hours  
**Phase:** 3 (Optional Polish)

---

## 📝 Description

Conduct targeted performance optimization based on Instruments profiling results (MONO-009) to improve launch time, reduce memory footprint, and enhance animation smoothness.

**Prerequisite:** MONO-009 must be completed to identify bottlenecks

---

## 🎯 Acceptance Criteria

- [ ] Launch time reduced by 15% (target: <1.5s)
- [ ] Memory baseline reduced by 10% (target: <45MB)
- [ ] All animations maintain 60 FPS
- [ ] Battery drain <1.5% per hour
- [ ] No regressions in functionality
- [ ] Performance report shows improvements

---

## 🔧 Optimization Areas

### **1. Launch Time Optimization (1h)**

#### **Profile Findings (Hypothetical)**
```
Cold Launch Breakdown:
- didFinishLaunching: 600ms
- State restoration (JSON decode): 200ms
- Initial view render: 800ms
- Live Activity query: 400ms
─────────────────────────────────
Total: 2000ms (target: <1500ms)
```

#### **Optimizations**

**A. Defer Non-Critical Work**
```swift
// MonoFocusApp.swift

var body: some Scene {
    WindowGroup {
        ContentView()
            .task {
                // Defer non-critical initialization
                await initializeServices()
            }
    }
}

private func initializeServices() async {
    // Move these off the critical path:
    await notificationService.requestAuthorizationIfNeeded()
    
    // Delay Live Activity query by 500ms
    try? await Task.sleep(for: .milliseconds(500))
    timerVM.handleSceneDidBecomeActive(notificationService: notificationService)
}
```

**B. Optimize State Restoration**
```swift
// TimerViewModel.swift

private func restoreState() {
    // Currently synchronous JSON parsing—optimize:
    Task.detached(priority: .utility) {
        let state = await loadStateAsync()
        await MainActor.run {
            applyRestoredState(state)
        }
    }
}

private func loadStateAsync() async -> TimerState? {
    // Move JSON parsing off main thread
    guard let data = try? Data(contentsOf: stateURL) else { return nil }
    return try? JSONDecoder().decode(TimerState.self, from: data)
}
```

---

### **2. Memory Optimization (1h)**

#### **Profile Findings (Hypothetical)**
```
Memory Allocations:
- UIImage caching: 5MB (SF Symbols cached)
- SwiftUI view hierarchy: 15MB
- JSON session history: 3MB (50 sessions)
- Foundation overhead: 22MB
─────────────────────────────────
Total: 45MB (target: <40MB)
```

#### **Optimizations**

**A. Limit Session History in Memory**
```swift
// SessionRepository.swift

func loadSessions(limit: Int = 50) -> [FocusSession] {
    guard let data = try? Data(contentsOf: storageURL) else { return [] }
    let all = (try? JSONDecoder().decode([FocusSession].self, from: data)) ?? []
    
    // Only keep last N sessions in memory
    return Array(all.suffix(limit))
}
```

**B. Release Timer Subscription When Not Running**
```swift
// TimerViewModel.swift

private func scheduleTick() {
    tickCancellable?.cancel()
    tickCancellable = nil  // Explicitly nil to release
    
    guard endDate != nil else { return }
    tickCancellable = Timer.publish(every: 1, on: .main, in: .common)
        .autoconnect()
        .sink { [weak self] _ in
            self?.syncRemainingWithClock(shouldFinalize: true, triggerHaptics: true)
        }
}
```

---

### **3. Animation Optimization (1h)**

#### **Profile Findings (Hypothetical)**
```
Animation Performance:
- Circular progress: 60 FPS ✅
- Modal transitions: 55 FPS ⚠️ (occasional drops)
- Button presses: 60 FPS ✅
```

#### **Optimizations**

**A. Reduce Modal Rendering Complexity**
```swift
// CustomModal.swift

private var modalContent: some View {
    content()
        .drawingGroup()  // Render to offscreen buffer (faster)
        .frame(width: 320)
        .background(
            RoundedRectangle(cornerRadius: Radius.value(.xl), style: .continuous)
                .fill(Color.monoBackground)
        )
        // ... rest of styling
}
```

**B. Optimize CircularProgressView**
```swift
// CircularProgressView.swift

var body: some View {
    ZStack {
        // Cache stroke style
        Circle()
            .stroke(
                Color.surface(progress <= 0 ? .surface3 : .surface2),
                style: strokeStyle
            )
        
        // Use .drawingGroup() for complex paths
        Circle()
            .trim(from: 0, to: CGFloat(clampedProgress))
            .stroke(
                AngularGradient(/* ... */),
                style: strokeStyle
            )
            .drawingGroup()  // Composite off-screen
            .rotationEffect(.degrees(-90))
    }
}

private var strokeStyle: StrokeStyle {
    StrokeStyle(lineWidth: strokeWidth, lineCap: .round)
}
```

---

### **4. Battery Optimization (30m)**

**A. Reduce Timer Tick Frequency When Backgrounded**
```swift
// TimerViewModel.swift

func prepareForBackground() {
    if isRunning {
        syncRemainingWithClock(shouldFinalize: true, triggerHaptics: false)
        tickCancellable?.cancel()  // Stop ticking in background
        scheduleBackgroundProcessing()  // Wake near completion only
    }
    persistState()
}
```

**B. Avoid Unnecessary State Updates**
```swift
private func syncRemainingWithClock(shouldFinalize: Bool, triggerHaptics: Bool) {
    guard let target = endDate else { return }
    let newRemaining = max(0, Int(ceil(target.timeIntervalSinceNow)))
    
    // Only publish if value changed
    if newRemaining != remainingSeconds {
        remainingSeconds = newRemaining
    }
    
    if newRemaining <= 0 && shouldFinalize {
        finishCurrentSession(triggerHaptics: triggerHaptics)
    }
}
```

---

## 📊 Measurement & Validation

### **Before/After Metrics**

| Metric | Before | Target | After |
|--------|--------|--------|-------|
| Cold launch | 2.0s | <1.5s | ___ |
| Memory baseline | 50MB | <45MB | ___ |
| Peak memory | 75MB | <70MB | ___ |
| Modal animation FPS | 55 | 60 | ___ |
| Battery (1h) | 2.0% | <1.5% | ___ |

---

## 📋 Subtasks

- [ ] Analyze MONO-009 profiling results (30m)
- [ ] Implement launch time optimizations (1h)
- [ ] Implement memory optimizations (1h)
- [ ] Implement animation optimizations (1h)
- [ ] Implement battery optimizations (30m)
- [ ] Re-run Instruments profiling (30m)
- [ ] Compare before/after metrics
- [ ] Document improvements in performance report
- [ ] Regression testing (30m)

---

## 🧪 Testing

### **Performance Regression Tests**
```bash
# Launch time
time xcodebuild test \
  -project MonoFocus.xcodeproj \
  -scheme MonoFocus \
  -destination 'platform=iOS Simulator,name=iPhone 14'

# Memory baseline (via Instruments)
instruments -t Allocations \
  -D allocations.trace \
  MonoFocus.app

# Animation FPS (via Xcode Debug Gauge)
# Enable: Debug → Show FPS Gauge
```

---

## 🔗 Related

- **Code Review:** Issue #9 (Low Priority)
- **Dependencies:** MONO-009 (must complete first)
- **Files Modified:** Various (based on profiling results)

---

## ⚠️ Risks

- **Medium Risk:** Optimizations could introduce subtle bugs
- **Mitigation:** Comprehensive regression testing after each change
- **Timeline:** Post-MVP only (not blocking launch)

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead  
**Priority Note:** Only pursue if MONO-009 identifies actionable bottlenecks
