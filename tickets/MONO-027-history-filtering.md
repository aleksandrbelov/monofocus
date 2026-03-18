# MONO-027: History Filtering (Date Range & Completion Status)

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Add a filter toolbar to the History view so users can narrow sessions by date range (this week / this month / all time) and completion status (completed only / all).

---

## 🎯 Acceptance Criteria

- [ ] Filter bar below the chart with two segmented controls: Date Range + Status
- [ ] Date Range options: "This Week", "This Month", "All Time"
- [ ] Status options: "All", "Completed", "Incomplete"
- [ ] Filters compose (both applied simultaneously)
- [ ] Active filter is persisted in `@AppStorage` so it survives app restarts
- [ ] Weekly chart (MONO-025) updates to reflect current date-range filter
- [ ] Empty state updates when filters produce no results

---

## 📋 Implementation Notes

- `HistoryViewModel` (or equivalent) exposes a `filteredSessions` computed property
- `@AppStorage("historyDateFilter")` and `@AppStorage("historyStatusFilter")` for persistence

---

## 🔗 Related

- MONO-024 (History list)
- MONO-025 (Chart — must reflect filter)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
