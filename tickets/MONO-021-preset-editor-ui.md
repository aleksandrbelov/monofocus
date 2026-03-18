# MONO-021: Preset Editor UI

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 4 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Add a Preset Editor screen (a `NavigationStack`-based sheet) where users can add, edit, reorder, and delete timer presets. The editor follows the existing monochrome design system.

---

## 🎯 Acceptance Criteria

- [ ] Accessible via a "Presets" button / gear icon on the main timer view
- [ ] Shows list of presets (label, duration) with swipe-to-delete on custom presets
- [ ] Built-in presets (25/45/90) are listed but cannot be deleted
- [ ] "Add Preset" sheet: text field for label, stepper / wheel picker for minutes (1–180)
- [ ] Tap a preset row to edit label or duration
- [ ] Drag-to-reorder supported (`List` with `.onMove`)
- [ ] Changes persist immediately via `PresetStore` (MONO-020)
- [ ] VoiceOver labels on all controls
- [ ] Unit tests for add / delete / reorder logic in `PresetStore`

---

## 🎨 Design Notes

- Use `DesignSystem` components: `DSButton`, `DSTextField`, `DSLabel`
- Follow existing `SetupView.swift` sheet pattern for modal presentation
- Destructive delete uses `.destructive` tint on swipe action
- Emoji picker (optional, future): show text field with emoji keyboard hint

---

## 🔗 Related

- MONO-020 (Model & persistence — must be complete first)
- MONO-022 (Widget sync)
- [`mobile/Views/SetupView.swift`](../../mobile/Views/SetupView.swift) — reference sheet pattern

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
