# MONO-032: Notification Sound Picker

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Let users choose an end-of-session notification sound from a curated list of system sounds (or "None"). The selected sound is stored in `UserDefaults` and applied when scheduling the `UNNotificationRequest`.

---

## 🎯 Acceptance Criteria

- [ ] Sound picker in Settings → Notifications section
- [ ] Options: "Default", "Chime", "Bell", "Glass", "None"
- [ ] Tapping an option plays a short preview via `AudioServicesPlaySystemSound`
- [ ] Selected option persisted with `@AppStorage("notificationSound")`
- [ ] `NotificationService.scheduleEndOfSessionNotification` reads setting and sets `UNNotificationSound`
- [ ] "None" maps to `UNNotificationSound` with silent content (badge-only notification)

---

## 📋 System Sound IDs (curated subset)

| Name | System Sound ID |
|------|----------------|
| Default | `UNNotificationSound.default` |
| Chime | 1013 |
| Bell | 1005 |
| Glass | 1003 |

---

## 🔗 Related

- MONO-030 (Settings view)
- `mobile/Services/NotificationService.swift`

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 4
