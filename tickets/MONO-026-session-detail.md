# MONO-026: Session Detail View

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

A lightweight detail view presented when the user taps a session row in the History list. Shows all metadata for a single `FocusSession` and offers a share/delete action.

---

## 🎯 Acceptance Criteria

- [ ] Presented as a `.sheet` or `navigationDestination` from the history list
- [ ] Displays: preset label, start date/time, planned duration, actual elapsed time, completion status
- [ ] "Share" button opens a share sheet with a formatted plain-text summary
- [ ] "Delete" button removes the session (with confirmation alert) and dismisses
- [ ] VoiceOver-navigable with logical focus order

---

## 🔗 Related

- MONO-024 (History list — tapping row navigates here)
- MONO-028 (Batch delete — single-session delete is the atomic building block)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
