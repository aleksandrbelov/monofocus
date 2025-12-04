# MONO-016: TestFlight Beta Feedback Cycle

**Type:** QA/User Testing  
**Priority:** 🟡 High  
**Status:** Blocked by Phase 1  
**Estimate:** 3 days (ongoing)  
**Phase:** 3 (Polish & Launch Prep)

---

## 📝 Description

Conduct TestFlight beta testing with 5-10 external users to gather real-world feedback, identify edge cases, and validate product-market fit before production launch.

**Goal:** Achieve NPS >8/10 and identify any critical issues missed in internal testing.

---

## 🎯 Acceptance Criteria

- [ ] Beta build uploaded to TestFlight
- [ ] 5-10 beta testers recruited
- [ ] Beta testing period: 7-14 days
- [ ] Feedback form completed by all testers
- [ ] NPS score >8/10
- [ ] All P0 bugs fixed
- [ ] P1 bugs fixed or deferred with approval
- [ ] Positive feedback on core UX

---

## 🚀 Beta Launch Checklist

### **Pre-Flight (Before Upload)**
- [ ] All Phase 1 tickets complete (MONO-001, 002, 007, 008, 009)
- [ ] Build in Release configuration
- [ ] Version bumped: 0.1.0 → 0.2.0-beta.1
- [ ] App Icon finalized
- [ ] Privacy policy URL configured
- [ ] Support email configured
- [ ] TestFlight screenshots ready
- [ ] Beta testing disclaimer added

### **Upload to TestFlight**
```bash
cd /Users/oleksandrbielov/dev/MonoFocus-Dev-Starter/MonoFocus

# Archive for distribution
xcodebuild archive \
  -project MonoFocus.xcodeproj \
  -scheme MonoFocus \
  -archivePath ~/Desktop/MonoFocus.xcarchive \
  -configuration Release

# Export IPA
xcodebuild -exportArchive \
  -archivePath ~/Desktop/MonoFocus.xcarchive \
  -exportPath ~/Desktop/MonoFocus \
  -exportOptionsPlist ExportOptions.plist

# Upload via Transporter app or:
xcrun altool --upload-app \
  --type ios \
  --file ~/Desktop/MonoFocus/MonoFocus.ipa \
  --username "your@email.com" \
  --password "@keychain:AC_PASSWORD"
```

---

## 👥 Beta Tester Recruitment

### **Target Profile**
- iOS users (iPhone SE to 14 Pro Max)
- iOS 16.0+ installed
- Mix of experience levels:
  - 2-3 power users (designers, developers)
  - 3-4 casual users (typical app users)
  - 1-2 accessibility users (VoiceOver, Dynamic Type)

### **Recruitment Channels**
- [ ] Personal network
- [ ] Twitter/X announcement
- [ ] Product Hunt Ship subscribers
- [ ] Reddit r/productivity (if allowed)
- [ ] iOS Beta Testing Facebook groups

### **Invitation Template**
```
Subject: Early Access: MonoFocus Timer Beta

Hi [Name],

I'm launching MonoFocus, a minimalist focus timer for iOS, and would love your feedback.

What it does:
- Single-screen timer with quick presets (15, 30, 60 min)
- Lock Screen widgets for 1-tap start
- Optional automation (DND, grayscale via Shortcuts)

Beta period: 7-14 days
Commitment: ~1 hour total (setup + usage + feedback)

Interested? Reply and I'll send the TestFlight link.

Thanks!
[Your Name]
```

---

## 📋 Beta Testing Instructions

**Send to testers after TestFlight acceptance:**

```markdown
# MonoFocus Beta Testing Guide

Welcome to the MonoFocus beta! 🎉

## Setup (5 min)
1. Install from TestFlight link
2. Grant notification permission (optional)
3. Add Lock Screen widget (optional)
4. Try a 5-minute test timer

## What to Test (30 min)
- [ ] Start/pause/resume/stop timer
- [ ] Test all presets (15, 30, 60 min)
- [ ] Complete one full session
- [ ] Try Lock Screen widget
- [ ] Toggle light/dark theme
- [ ] (Optional) Set up Shortcuts automation

## Focus Areas
- Does the timer work reliably?
- Is the UI intuitive?
- Any crashes or bugs?
- Performance issues (laggy animations)?
- Accessibility (if applicable)

## Feedback Form (15 min)
Please complete by [date]:
[Google Form / Typeform link]

## Support
Questions? Email: support@monofocus.dev
Bugs? Use TestFlight feedback button or email

Thank you! 🙏
```

---

## 📊 Feedback Form Template

**Create Google Form with these sections:**

### **Section 1: Demographics**
- Device model (dropdown)
- iOS version (dropdown)
- Experience level (Novice / Intermediate / Advanced)

### **Section 2: Usability (1-5 scale)**
- How easy was it to start your first timer?
- How intuitive is the UI?
- How would you rate the overall design?

### **Section 3: Features**
- Which features did you use? (checkboxes)
  - [ ] Quick presets
  - [ ] Custom time
  - [ ] Lock Screen widget
  - [ ] Shortcuts automation
  - [ ] Theme toggle
- Which feature is most valuable to you?
- What's missing?

### **Section 4: Performance**
- Did you experience any crashes? (Yes/No + description)
- Did you notice any laggy animations? (Yes/No + where)
- Battery drain noticeable? (Yes/No)

### **Section 5: Accessibility (if applicable)**
- Did you use VoiceOver? (Yes/No)
- Did you test Dynamic Type? (Yes/No)
- Any accessibility issues?

### **Section 6: Net Promoter Score**
- How likely are you to recommend MonoFocus to a friend? (0-10)
- Why did you give that score?

### **Section 7: Open Feedback**
- What do you love about MonoFocus?
- What frustrated you?
- Any other comments?

---

## 🐛 Bug Triage Process

### **Severity Levels**
- **P0 (Critical):** Crashes, data loss, timer doesn't work
- **P1 (High):** Major features broken, poor UX
- **P2 (Medium):** Minor issues, cosmetic bugs
- **P3 (Low):** Nice-to-haves, future enhancements

### **Response Time**
- P0: Fix immediately, push beta update within 24h
- P1: Fix within 3 days or defer to v1.1
- P2/P3: Backlog for future releases

---

## 📈 Success Metrics

### **Quantitative**
- [ ] NPS score: >8/10 (target: 9/10)
- [ ] Completion rate: >80% of testers complete form
- [ ] Crash-free rate: >99%
- [ ] Battery complaints: <20% of testers

### **Qualitative**
- [ ] Positive sentiment on core timer UX
- [ ] Minimal confusion on setup
- [ ] Feature requests aligned with roadmap
- [ ] Accessibility feedback positive (if tested)

---

## 📋 Beta Timeline

### **Week 1: Launch & Onboarding**
- Day 0: Upload to TestFlight
- Day 1: Invite testers, send instructions
- Day 2-3: Monitor crash reports, respond to questions
- Day 4: Send mid-point check-in email

### **Week 2: Feedback & Iteration**
- Day 7: Reminder to complete feedback form
- Day 8-10: Analyze feedback, triage bugs
- Day 11-12: Fix P0/P1 bugs, push beta update
- Day 13: Send final thank-you email

### **Week 3: Wrap-Up**
- Day 14: Close beta, compile final report
- Day 15: Make launch decision (go/no-go)

---

## 🔗 Related

- **Code Review:** Launch readiness requirement
- **Dependencies:** Phase 1 complete (MONO-001 to 009)
- **Files Created:**
  - `docs/BETA_TESTING_REPORT.md` (final report)

---

## ⚠️ Risks

- **Recruitment:** May be difficult to find 5-10 engaged testers
- **Engagement:** Testers may install but not use the app
- **Critical Bugs:** May discover showstoppers requiring delay

### **Mitigation**
- Offer incentive (App Store promo codes, acknowledgment in credits)
- Send reminder emails at day 4 and day 7
- Have rollback plan if critical bugs found

---

**Created:** November 5, 2025  
**Assignee:** Product Owner  
**Reviewer:** Team
