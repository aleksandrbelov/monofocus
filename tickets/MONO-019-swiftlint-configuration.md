# MONO-019: SwiftLint Configuration & Zero-Violation Pass

**Type:** Code Quality  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 2 hours  
**Sprint:** 3 (Quality & Developer Experience)

---

## 📝 Description

Add a `.swiftlint.yml` configuration file and fix all existing violations so the codebase runs with zero SwiftLint warnings. Integrate the lint step into the CI pipeline (see MONO-012).

---

## 🎯 Acceptance Criteria

- [ ] `.swiftlint.yml` added to repository root
- [ ] `swiftlint` runs with zero violations on `mobile/`
- [ ] CI workflow fails on any new violation (see MONO-012)
- [ ] `SwiftLint` run-script phase added to the `MonoFocus` Xcode target in `project.yml`

---

## 🔧 Suggested `.swiftlint.yml` Configuration

```yaml
included:
  - mobile

excluded:
  - mobile/MonoFocusWidgets
  - mobile/Utils/generateTheme.swift

disabled_rules:
  - todo  # tracked via tickets instead

opt_in_rules:
  - force_unwrapping
  - explicit_init
  - empty_count
  - closure_spacing
  - overridden_super_call
  - redundant_nil_coalescing

line_length:
  warning: 120
  error: 160

type_body_length:
  warning: 300
  error: 500

function_body_length:
  warning: 60
  error: 100
```

---

## 📋 Common Violations to Fix

| Rule | Likely locations |
|------|-----------------|
| `force_unwrapping` | `URLRouter.swift`, `MonoFocusWidgets.swift` |
| `trailing_whitespace` | Various |
| `line_length` | `TimerViewModel.swift`, `TimerLiveActivity.swift` |
| `unused_closure_parameter` | Combine pipelines |

---

## 🔗 Related

- MONO-012 (CI/CD pipeline — lint step depends on this)
- MONO-013 (Widget URL safety — fixes `force_unwrapping` in widgets)

---

**Created:** March 2026  
**Assignee:** iOS Engineer  
**Sprint:** 3
