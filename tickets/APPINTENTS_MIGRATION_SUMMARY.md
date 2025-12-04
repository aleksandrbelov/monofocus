# App Intents Migration - Executive Summary

## Current State

**Problem:** MonoFocus uses the legacy `shortcuts://run-shortcut?name=...` URL scheme to trigger user-created Shortcuts for DND and Grayscale automation. This approach is:
- Deprecated by Apple
- Error-prone (string-based name matching)
- Not testable
- Poor UX (requires manual shortcut naming)
- No Siri integration
- Cannot be used from widgets/Live Activities

**Architecture:**
```
User creates shortcuts manually
          ↓
ShortcutService stores names in UserDefaults
          ↓
runShortcut(named:) opens shortcuts:// URL
          ↓
System launches Shortcuts app (unreliable)
```

## Proposed Solution

**Approach:** Migrate to App Intents framework with **intent donations** that trigger user-configured automations in the Shortcuts app.

**Key Insight:** We cannot directly control system DND/Grayscale, but we can donate intents that **notify** the Shortcuts app when lifecycle events occur. Users create Shortcuts that listen for these events.

**New Architecture:**
```
Timer lifecycle events (start/complete/resume)
          ↓
AutomationService → IntentDonationManager
          ↓
System receives donated intent
          ↓
User's Shortcuts automatically trigger
          ↓
Shortcuts app controls DND/Grayscale
```

## Benefits

1. **Type Safety:** Strongly-typed intents, no string matching
2. **Reliability:** Direct system integration, no URL scheme failures
3. **Better UX:** One-time Shortcut setup via wizard, no name management
4. **Siri Ready:** "Start my focus timer" works out of the box
5. **Testable:** Can mock intent donations and verify logic
6. **Future-Proof:** Apple's recommended automation approach
7. **Performance:** Direct invocation, no inter-app URL overhead

## Migration Effort

**Total Time:** 2–3 days  
**Complexity:** Medium  
**Risk:** Medium (requires user re-setup, clean break from legacy)
**Target iOS:** 18.0+

### Phase Breakdown

| Phase | Tasks | Duration | Status |
|-------|-------|----------|--------|
| **1. Foundation** | Refactor existing intents, create dependency container | 1 day | Not started |
| **2. Intent Donations** | Create lifecycle intents, donation manager, replace ShortcutService | 1 day | Not started |
| **3. Documentation & Rollout** | Update docs, migration guide, setup wizard, testing | 1 day | Not started |

## Technical Highlights

### New Intents

**Timer Control (Refactored):**
- `StartFocusSessionIntent` - Start timer via Siri/Shortcuts
- `StopFocusSessionIntent` - Stop timer
- `PauseFocusSessionIntent` - Pause timer (NEW)
- `ResumeFocusSessionIntent` - Resume timer (NEW)

**Automation Signals (NEW):**
- `SessionDidStartIntent` - Donated when session begins
- `SessionDidCompleteIntent` - Donated when session ends
- `SessionDidResumeIntent` - Donated when session resumes
- `SessionWillEndIntent` - Donated when paused/stopped

### New Services

**`AutomationService`** (replaces ShortcutService)
- Manages automation toggles (DND/Grayscale enabled)
- Coordinates intent donations
- Falls back to legacy URL scheme for iOS <16

**`IntentDonationManager`**
- Donates intents to system at appropriate times
- Async/non-blocking
- Rate-limited to prevent spam

**`AppDependencyContainer`**
- Singleton for injecting services into intents
- Intents cannot access SwiftUI environment

## User Impact

### Before (Current)
1. User creates 4 shortcuts manually: "MonoFocus DND", "MonoFocus Grayscale", "MonoFocus DND Off", "MonoFocus Grayscale Off"
2. User enters exact names in app settings
3. User taps "Save" to persist names
4. App opens shortcuts:// URL when timer events occur
5. **Pain:** Error-prone, confusing, unreliable

### After (App Intents)
1. **Requires iOS 18.0+** to use the app
2. User opens app, taps "Setup Automations" button
3. Guided wizard explains process with screenshots
4. User creates 2-4 automations in Shortcuts app:
   - "When MonoFocus starts session → Enable Focus Filter"
   - "When MonoFocus completes session → Disable Focus Filter"
   - (optional) Grayscale variants
5. App automatically donates intents when events occur
6. Shortcuts automatically trigger—no name management needed
7. **Benefit:** One-time setup, reliable, Siri-ready

### Migration Impact
- **Users on iOS <18:** Must upgrade iOS or cannot use app after update
- **Current users on iOS 18+:** Will need to recreate automation setup once
- **New users:** Clean, modern setup experience from day one

## Technical Highlights

### New Intents

**Timer Control (Refactored):**
- `StartFocusSessionIntent` - Start timer via Siri/Shortcuts
- `StopFocusSessionIntent` - Stop timer
- `PauseFocusSessionIntent` - Pause timer (NEW)
- `ResumeFocusSessionIntent` - Resume timer (NEW)

**Automation Signals (NEW):**
- `SessionDidStartIntent` - Donated when session begins
- `SessionDidCompleteIntent` - Donated when session ends
- `SessionDidResumeIntent` - Donated when session resumes
- `SessionWillEndIntent` - Donated when paused/stopped

### New Services

**`AutomationService`** (replaces ShortcutService)
- Manages automation toggles (DND/Grayscale enabled)
- Coordinates intent donations
- No legacy fallback—iOS 18+ only

**`IntentDonationManager`**
- Donates intents to system at appropriate times
- Async/non-blocking
- Rate-limited to prevent spam

**`AppDependencyContainer`**
- Singleton for injecting services into intents
- Intents cannot access SwiftUI environment

## Success Metrics

- ✅ 100% Siri phrase coverage for timer controls
- ✅ Intent donation latency <50ms
- ✅ Setup wizard completion rate ≥90%
- ✅ Support tickets for automation issues down 50%
- ✅ Zero App Store rejections for private API usage
- ✅ Unit test coverage ≥80% for automation services

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Users confused by setup wizard | Include video walkthrough + templates |
| Intent donations fail silently | Add diagnostic logging + connection status UI |
| iOS 18 requirement limits user base | Communicate clearly in App Store, analyze adoption metrics |
| Shortcuts app changes automation API | Monitor beta releases, subscribe to dev forums |

## Open Questions

1. **Can we export Shortcut templates for one-tap import?**  
   → Research `shortcuts://import-shortcut` deep links

2. **Should we integrate with Focus Filters API directly?**  
   → Investigate iOS 18+ entitlements and capabilities

3. **Should widget taps also donate intents?**  
   → Decision: Yes—refactor widget URL handling to donate intents

## Next Actions

1. **Review with stakeholders** (Product, Design, QA) - 1 hour meeting
2. **Spike: Shortcut import/export research** - 2 hours
3. **Design setup wizard mockups** - collaborate with design team
4. **Create subtasks in project management tool** - break down phases
5. **Begin Phase 1: Foundation** - start refactoring existing intents

---

**Full Details:** See `MONO-017-appintents-migration-plan.md`  
**Status:** Awaiting approval  
**Priority:** High  
**Target Release:** v2.1.0
