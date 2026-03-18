# MONO-025: Weekly Focus-Time Bar Chart

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 3 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Add a weekly bar chart at the top of the History view showing daily focus minutes for the last 7 days. Built with Swift Charts (iOS 16+) to stay within the zero-external-dependencies constraint.

---

## 🎯 Acceptance Criteria

- [ ] Chart shows the last 7 calendar days (x-axis: day abbreviation, y-axis: minutes)
- [ ] Each bar represents total completed focus minutes for that day
- [ ] Today's bar is visually highlighted (accent colour)
- [ ] Days with no sessions show a zero-height bar (not hidden)
- [ ] Chart has an accessible `.chartAccessibilityLabel` summary
- [ ] Tapping a bar scrolls the list below to that day's section
- [ ] Chart animates in on first appearance (`.chartPlotStyle` scale animation)

---

## 📋 Implementation Notes

- Use `import Charts` (Swift Charts, available iOS 16+; project targets iOS 18)
- Data source: aggregate `sessions.json` entries by calendar day using `Calendar.current`
- Compute `[DayBucket(date: Date, totalMinutes: Int)]` in a view model or computed property
- No external charting libraries — Swift Charts is sufficient

---

## 🔗 Related

- MONO-024 (History list view — chart is embedded at the top)
- MONO-027 (Filtering — chart updates when filter is active)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
