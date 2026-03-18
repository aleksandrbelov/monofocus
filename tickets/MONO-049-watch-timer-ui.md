# MONO-049: Watch Timer UI

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 6 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Build the watchOS app's main UI: a large countdown display with Start/Pause/Stop controls, mirroring the iOS app's monochrome design in watchOS-appropriate layout.

---

## 🎯 Acceptance Criteria

- [ ] Main watch face: large monospaced countdown (MM:SS)
- [ ] Circular progress ring around the digit (matches iOS Live Activity style)
- [ ] Digital Crown scrolls through preset durations when idle
- [ ] "Start" button starts timer; confirms with Taptic Engine (MONO-051)
- [ ] Running state shows "Pause" and "Stop" buttons
- [ ] Paused state shows "Resume" and "Stop" buttons
- [ ] Timer state syncs with iPhone via `WatchConnectivity` (MONO-050)
- [ ] Supports Always-On Display (AOD): dim mode shows time remaining in minimal style
- [ ] VoiceOver: labels and hints on all controls

---

## 🎨 Design Notes

- Use `TimelineView(.animation)` for the countdown during running state
- Monochrome scheme — use `.white` / `.black` adaptive colors
- `NavigationStack` → detail → history (future; stub for now)

---

## 🔗 Related

- MONO-048 (watchOS target setup — must exist first)
- MONO-050 (WatchConnectivity sync — state shared here)
- MONO-051 (Taptic Engine feedback)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 5
