# MONO-048: watchOS Target Setup

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Add a `MonoFocusWatch` watchOS app extension target to `project.yml` using XcodeGen. This ticket covers project structure only — no UI.

---

## 🎯 Acceptance Criteria

- [ ] `MonoFocusWatch` watchOS app target added in `project.yml`
- [ ] Bundle ID: `dev.monofocus.app.watchkitapp`
- [ ] Minimum deployment: watchOS 10.0
- [ ] `MonoFocus` target depends on `MonoFocusWatch` (embeds the extension)
- [ ] `xcodegen generate` succeeds; project builds on simulator
- [ ] `FocusSession` model shared between iOS and watchOS targets
- [ ] App Group `group.dev.monofocus.data` capability added to watchOS target

---

## 📋 project.yml Changes (outline)

```yaml
targets:
  MonoFocusWatch:
    type: watchkit-app
    platform: watchOS
    deploymentTarget: "10.0"
    bundleIdPrefix: dev.monofocus.app
    sources:
      - path: watch
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: dev.monofocus.app.watchkitapp
    dependencies:
      - target: MonoFocus
        embed: false
```

---

## 🔗 Related

- MONO-049 (Watch timer UI)
- MONO-050 (WatchConnectivity sync)
- MONO-051 (Taptic feedback)
- MONO-052 (Watch complications)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 5
