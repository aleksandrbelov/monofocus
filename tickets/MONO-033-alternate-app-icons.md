# MONO-033: Alternate App Icon Variants

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 3 hours  
**Sprint:** 4 (User Experience Enhancements)

---

## 📝 Description

Provide three alternate app icon variants (Default, Light, Dark) that users can select in Settings → Appearance. Uses `UIApplication.shared.setAlternateIconName(_:)`.

---

## 🎯 Acceptance Criteria

- [ ] Three icon variants designed and exported at all required resolutions
  - **Default** — current monochrome icon
  - **Light** — white background, dark symbol
  - **Dark** — black background, white symbol
- [ ] Icon assets added to `Assets.xcassets` as alternate icon sets
- [ ] `project.yml` updated with `CFBundleAlternateIcons` entries
- [ ] Picker in Settings → Appearance shows icon previews in a horizontal scroll view
- [ ] Selecting an icon calls `UIApplication.shared.setAlternateIconName(_:completionHandler:)`
- [ ] Currently active icon is visually indicated with a checkmark

---

## 📋 Asset Sizes Required

Per Apple guidelines: 60×60, 120×120 (2×), 180×180 (3×) pt at @1x/2x/3x.

---

## 🔗 Related

- MONO-030 (Settings view)

---

**Created:** March 2026  
**Assignee:** iOS Engineer / Designer  
**Sprint:** 4
