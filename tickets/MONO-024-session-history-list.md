# MONO-024: Session History List View

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 4 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Add an in-app Session History screen that displays past focus sessions grouped by day. Replace or complement the CSV-only export with a native browseable history view.

---

## 🎯 Acceptance Criteria

- [ ] History sheet accessible via a history icon button on the main timer view
- [ ] Sessions grouped by calendar day with a daily total duration header
- [ ] Each row shows: preset label (or minutes), start time, duration, completion badge
- [ ] Empty state: illustration + "No sessions yet — start your first focus session"
- [ ] Tap a row → session detail view (MONO-026)
- [ ] List is sorted newest-first
- [ ] VoiceOver: each row announces duration and completion status
- [ ] Loads asynchronously; does not block timer screen

---

## 🎨 Design Notes

- Use `List` with `Section` per day; section header shows date + total minutes
- Completion badge: green checkmark if `completed == true`, grey dot if incomplete
- Follows monochrome design system (`DSLabel`, `DSColors`, `Spacing` tokens)

---

## 🔗 Related

- MONO-025 (Weekly chart — embedded at top of history view)
- MONO-026 (Session detail)
- MONO-027 (Filtering)
- MONO-028 (Batch delete)
- MONO-029 (Export)
- [`mobile/Models/FocusSession.swift`](../../mobile/Models/FocusSession.swift)
- [`mobile/Utils/SessionExporter.swift`](../../mobile/Utils/SessionExporter.swift)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
