# MONO-008: VoiceOver Full Navigation Audit

**Type:** Accessibility  
**Priority:** 🔴 Critical  
**Status:** Ready for Execution  
**Estimate:** 2 hours  
**Phase:** 1 (Critical Path)

---

## 📝 Description

Conduct comprehensive VoiceOver accessibility audit to ensure all screens, controls, and modals are navigable and usable for blind and low-vision users.

**Compliance Target:** WCAG 2.1 Level AA

---

## 🎯 Acceptance Criteria

- [ ] All interactive elements have accessibility labels
- [ ] Focus order is logical and sequential
- [ ] Modals announce correctly when appearing
- [ ] Timer state changes are announced
- [ ] All buttons have hints describing their action
- [ ] Decorative elements are hidden from VoiceOver
- [ ] No "orphaned" focusable elements
- [ ] User can complete full timer cycle eyes-free

---

## 🧪 VoiceOver Test Scenarios

### **1. Initial Launch (5 min)**
```
Enable VoiceOver: Settings → Accessibility → VoiceOver
```

- [ ] Open app → Header announced
- [ ] Swipe right → Timer display announced with value
- [ ] Swipe right → Preset buttons in logical order
- [ ] Swipe right → Control buttons announced
- [ ] Swipe right → Automation section announced
- [ ] Verify focus doesn't jump unexpectedly

**Expected Announcements:**
- "MonoFocus, heading"
- "Remaining time, 25 minutes 0 seconds"
- "15 minutes, button. Set preset to 15 minutes"
- "Start, button. Starts the focus timer"

### **2. Timer Operations (15 min)**
- [ ] Select "25 minutes" preset
  - Announced: "25 minutes selected"
- [ ] Tap "Start" button
  - Announced: "Timer started"
  - Timer updates announced periodically
- [ ] Tap "Pause" button
  - Announced: "Timer paused"
- [ ] Tap "Resume" button
  - Announced: "Timer resumed"
- [ ] Tap "Stop" button
  - Announced: "Timer stopped, reset to 25 minutes"

### **3. Modal Navigation (15 min)**
- [ ] Trigger completion modal
  - Announced: "Well Done! You've completed your focus session"
  - Focus trapped inside modal
  - Can dismiss with "Continue" button
- [ ] Open time picker modal (custom time)
  - Announced: "Set Custom Time"
  - Picker accessible
  - Can confirm or cancel
- [ ] Open setup sheet
  - Announced: "Setup"
  - Can navigate content
  - Can dismiss

### **4. Automation Section (10 min)**
- [ ] Navigate to DND toggle
  - Announced: "Do Not Disturb, switch, off"
  - Can toggle with double-tap
  - State change announced
- [ ] Navigate to Grayscale toggle
  - Announced: "Grayscale, switch, off"
  - Can toggle with double-tap

### **5. Lock Screen Widget (10 min)**
- [ ] Add widget to Lock Screen
- [ ] Lock device
- [ ] Enable VoiceOver
- [ ] Navigate to widget
  - Each preset announced: "25 minutes, button"
- [ ] Double-tap preset
  - App opens with timer started
  - Announced: "MonoFocus. Timer started, 25 minutes"

---

## 🔍 Accessibility Inspector Checklist

Use Xcode Accessibility Inspector:

```
Xcode → Open Developer Tool → Accessibility Inspector
```

### **Audit Checklist**
- [ ] Run "Audit" on main screen
- [ ] Fix all "missing label" warnings
- [ ] Fix all "element not accessible" warnings
- [ ] Fix all "contrast" warnings
- [ ] Verify "Hit region too small" (min 44×44pt)
- [ ] Check "Traits" are appropriate (button, heading, etc.)

### **Focus Order Validation**
- [ ] Tab through all elements in logical order
- [ ] No unexpected jumps
- [ ] Modals trap focus appropriately
- [ ] Dismiss gestures work

---

## 📋 Code Review Checklist

Verify these patterns in code:

### **✅ Good Patterns**
```swift
// Descriptive labels
.accessibilityLabel("Remaining time")
.accessibilityValue(timer.formattedTime(timer.remainingSeconds))

// Action hints
.accessibilityHint("Set preset to \(m) minutes")

// Hide decorative elements
.accessibilityHidden(true)

// Modal traits
.accessibilityAddTraits(.isModal)

// Focus management
.accessibilityFocused($isAccessibilityFocused)
```

### **❌ Missing/Incorrect**
- [ ] Buttons without labels
- [ ] Images without descriptions
- [ ] Custom controls without traits
- [ ] Modals without focus management
- [ ] Dynamic content not announced

---

## 🛠️ Common Issues & Fixes

### **Issue: Timer updates not announced**
```swift
// Add this to TimerViewModel
@Published var accessibilityAnnouncement: String?

// In syncRemainingWithClock():
if remainingSeconds % 60 == 0 {  // Announce every minute
    let minutes = remainingSeconds / 60
    accessibilityAnnouncement = "\(minutes) minutes remaining"
}

// In view:
.accessibilityElement(children: .combine)
.accessibilityValue(timer.formattedTime(timer.remainingSeconds))
.onChange(of: timer.accessibilityAnnouncement) { announcement in
    if let announcement {
        UIAccessibility.post(notification: .announcement, argument: announcement)
    }
}
```

### **Issue: Modal doesn't announce when appearing**
```swift
// Already implemented in CustomModal.swift ✅
private func announceForAccessibility() {
    guard UIAccessibility.isVoiceOverRunning else { return }
    DispatchQueue.main.async {
        self.isAccessibilityFocused = true
        UIAccessibility.post(notification: .screenChanged, argument: nil)
    }
}
```

---

## 📊 Accessibility Metrics

### **Pass Criteria**
- ✅ 100% of interactive elements labeled
- ✅ 100% of actions have hints
- ✅ 0 contrast violations (WCAG AA)
- ✅ 0 "Hit region too small" warnings
- ✅ Can complete timer cycle without sight

### **Testing Devices**
- iPhone 14 Pro (primary)
- iPhone SE (small screen validation)

---

## 📋 Subtasks

- [ ] Enable VoiceOver on test device
- [ ] Complete initial launch audit (5 min)
- [ ] Test timer operations (15 min)
- [ ] Test modal navigation (15 min)
- [ ] Test automation controls (10 min)
- [ ] Test Lock Screen widget (10 min)
- [ ] Run Accessibility Inspector audit
- [ ] Fix any violations found
- [ ] Re-test after fixes
- [ ] Sign off on accessibility compliance

---

## 🔗 Related

- **Code Review:** Accessibility grade: A
- **Testing Plan:** Section 2 (Accessibility Testing)
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

## ⚠️ Risks

- **Time Estimate:** May take longer if major issues found
- **Blocking:** P0 accessibility issues will block TestFlight release

---

**Created:** November 5, 2025  
**Assignee:** QA Engineer + iOS Developer  
**Reviewer:** Accessibility Lead
