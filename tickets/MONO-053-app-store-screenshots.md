# MONO-053: App Store Screenshots & Preview Assets

**Type:** Launch  
**Priority:** 🔴 Critical  
**Status:** Backlog  
**Estimate:** 4 hours  
**Sprint:** 6 (Production Launch)

---

## 📝 Description

Produce App Store screenshots for all required device sizes, showing the key user stories: idle state, running timer, Live Activity on Lock Screen, and widget.

---

## 🎯 Acceptance Criteria

- [ ] Screenshots for: iPhone 6.9" (Pro Max), iPhone 6.7" (Plus), iPhone 6.1" (standard), iPhone 5.5" (legacy)
- [ ] iPad 13" and 12.9" if submitting universal binary
- [ ] Minimum 3, maximum 10 screenshots per device size
- [ ] Required scenes:
  1. Timer idle with preset buttons
  2. Timer counting down (running state)
  3. Lock Screen with Live Activity
  4. Home Screen small widget
  5. History screen with weekly chart
  6. Settings screen
- [ ] Screenshots match final approved design (no placeholder text)
- [ ] Optional: 30-second app preview video for 6.9" size

---

## 📋 Tooling

- Use Xcode Simulator + `xcrun simctl io booted screenshot` for automated captures
- Post-process with `fastlane frameit` or Sketch/Figma device frames (optional)

---

## 🔗 Related

- MONO-054 (App Store metadata)
- All Sprint 4 UI features must be complete before final screenshots

---

**Created:** March 2026  
**Assignee:** iOS Engineer / Designer  
**Sprint:** 6
