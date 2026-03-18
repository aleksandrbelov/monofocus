# MONO-030: Settings View Scaffold

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Create a Settings screen presented as a sheet from the main timer view. Acts as the container for all user preferences in Sprint 4 (MONO-031–034) and future settings.

---

## 🎯 Acceptance Criteria

- [ ] Settings sheet accessible via a gear icon (`.toolbar` item) on `TimerView`
- [ ] Uses `NavigationStack` + `Form` layout for native iOS appearance
- [ ] Contains sections: "Timer", "Notifications", "Appearance", "About"
- [ ] "About" section: app version (from `Bundle.main.infoDictionary`), link to privacy policy
- [ ] Dismissible via swipe-down or "Done" button
- [ ] Settings state injected via `@EnvironmentObject` or `@AppStorage`

---

## 📋 Sections Planned (current sprint)

| Section | Settings |
|---------|----------|
| Timer | Keep screen awake (MONO-034), presets shortcut to editor (MONO-021) |
| Notifications | Sound picker (MONO-032) |
| Appearance | App icon variant (MONO-033) |
| About | Version, privacy policy URL |

---

## 🔗 Related

- MONO-031 (Haptic toggle)
- MONO-032 (Notification sound picker)
- MONO-033 (App icon variants)
- MONO-034 (Screen awake toggle)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
