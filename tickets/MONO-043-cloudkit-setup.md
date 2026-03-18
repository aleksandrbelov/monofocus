# MONO-043: CloudKit Container Setup & Capability

**Type:** Feature  
**Priority:** 🟡 High  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Add the CloudKit capability and container configuration to `project.yml` so iCloud session sync (MONO-045) can be built. No sync logic in this ticket — setup only.

---

## 🎯 Acceptance Criteria

- [ ] `iCloud` capability added in `project.yml` with `CloudKit` service
- [ ] Container identifier: `iCloud.dev.monofocus.app`
- [ ] `NSUbiquitousContainers` key added to `Info.plist`
- [ ] Privacy description: `NSUbiquityContainerIdentifiers` usage key added
- [ ] Entitlements file updated: `com.apple.developer.icloud-services`, `com.apple.developer.icloud-container-identifiers`
- [ ] App builds and launches without iCloud errors on simulator

---

## 📋 project.yml Changes

```yaml
targets:
  MonoFocus:
    entitlements:
      path: mobile/MonoFocus.entitlements
    settings:
      base:
        CODE_SIGN_ENTITLEMENTS: mobile/MonoFocus.entitlements
    capabilities:
      iCloud:
        cloudkit: true
        containers:
          - iCloud.dev.monofocus.app
```

---

## ⚠️ Privacy Note

iCloud sync is opt-in (user must be signed into iCloud). No data is sent anywhere if iCloud is disabled or the user is signed out.

---

## 🔗 Related

- MONO-044 (Conflict resolution strategy)
- MONO-045 (CloudKit sync service)
- MONO-047 (Privacy disclosure)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 5
