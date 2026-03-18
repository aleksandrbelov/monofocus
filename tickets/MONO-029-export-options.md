# MONO-029: Export Options (CSV + Plain-Text Share Sheet)

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Expose existing CSV export via a proper share sheet in the History view, and add a human-readable plain-text summary option (e.g. for pasting into a journal or notes app).

---

## 🎯 Acceptance Criteria

- [ ] "Export" toolbar button in History view opens an action sheet with two options: "Export CSV" and "Copy Summary"
- [ ] "Export CSV" — shares the existing `SessionExporter.exportCSV()` file via `UIActivityViewController`
- [ ] "Copy Summary" — copies a markdown-style weekly summary to the clipboard
  ```
  MonoFocus — Week of March 17, 2026
  
  Mon  45 min  ✓
  Tue  90 min  ✓
  Wed  —
  Thu  25 min  ✗ (stopped early)
  ...
  Total: 160 min across 3 completed sessions
  ```
- [ ] Export respects current filter (only exports visible sessions)
- [ ] `ActivityViewController` wrapper already exists at `mobile/Utils/ActivityViewController.swift`

---

## 🔗 Related

- MONO-024 (History list)
- MONO-027 (Filtering — export should respect filter)
- [`mobile/Utils/SessionExporter.swift`](../../mobile/Utils/SessionExporter.swift)
- [`mobile/Utils/ActivityViewController.swift`](../../mobile/Utils/ActivityViewController.swift)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
