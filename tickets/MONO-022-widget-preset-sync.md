# MONO-022: Sync Custom Presets to WidgetKit Timeline

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

After a user saves custom presets (MONO-020/021), reload WidgetKit timelines so preset buttons in widgets reflect the user's latest configuration without needing to relaunch the app.

---

## 🎯 Acceptance Criteria

- [ ] `PresetStore.save()` calls `WidgetCenter.shared.reloadAllTimelines()`
- [ ] Widget timeline provider reads `presets.json` from App Group container
- [ ] Up to 4 presets are shown in the widget (truncated gracefully if > 4)
- [ ] Widget falls back to default presets (25/45/90) if `presets.json` is missing
- [ ] Widget deep-link URL uses preset minutes: `monofocus://start?minutes=N`

---

## 📋 Implementation Notes

- `WidgetDataManager.fetchPresets()` — new helper mirroring `fetchState()`
- Update `TimelineProvider.getTimeline(in:completion:)` to include preset data in entry
- Widget button labels show preset `label` string (truncated to 12 chars) and minutes

---

## 🔗 Related

- MONO-020 (Preset model)
- MONO-021 (Preset editor — triggers the reload)
- [`mobile/MonoFocusWidgets/MonoFocusWidgets.swift`](../../mobile/MonoFocusWidgets/MonoFocusWidgets.swift)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
