# MONO-012: Set Up CI/CD Pipeline

**Type:** DevOps  
**Priority:** 🟢 Medium  
**Status:** Ready for Development  
**Estimate:** 3 hours  
**Phase:** 2 (Quality Improvements)

---

## 📝 Description

Create a GitHub Actions workflow to automate building, testing, and code quality checks on every push and pull request.

**Goal:** Catch regressions early and ensure consistent quality standards.

---

## 🎯 Acceptance Criteria

- [ ] GitHub Actions workflow created
- [ ] Runs on every push to `main` and pull requests
- [ ] Generates Xcode project via XcodeGen
- [ ] Builds project successfully
- [ ] Runs all unit tests
- [ ] Reports test coverage
- [ ] Fails on compiler warnings
- [ ] Badge added to README showing build status

---

## 🔧 Implementation Plan

### **1. Create Workflow File**

**Location:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    name: Build and Test
    runs-on: macos-13
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Select Xcode version
        run: sudo xcode-select -s /Applications/Xcode_15.0.app/Contents/Developer
      
      - name: Show Xcode version
        run: xcodebuild -version
      
      - name: Install XcodeGen
        run: brew install xcodegen
      
      - name: Generate Xcode project
        run: xcodegen generate
        working-directory: ./MonoFocus
      
      - name: Build for testing
        run: |
          xcodebuild clean build-for-testing \
            -project MonoFocus.xcodeproj \
            -scheme MonoFocus \
            -destination 'platform=iOS Simulator,name=iPhone 14,OS=17.0' \
            -enableCodeCoverage YES \
            CODE_SIGNING_ALLOWED=NO
        working-directory: ./MonoFocus
      
      - name: Run tests
        run: |
          xcodebuild test-without-building \
            -project MonoFocus.xcodeproj \
            -scheme MonoFocus \
            -destination 'platform=iOS Simulator,name=iPhone 14,OS=17.0' \
            -enableCodeCoverage YES \
            CODE_SIGNING_ALLOWED=NO
        working-directory: ./MonoFocus
      
      - name: Generate coverage report
        run: |
          xcrun xccov view --report --json \
            $(find ~/Library/Developer/Xcode/DerivedData -name '*.xcresult' | head -1)/action.xccovarchive \
            > coverage.json
          cat coverage.json
        working-directory: ./MonoFocus
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./MonoFocus/coverage.json
          fail_ci_if_error: false
      
      - name: Check for warnings
        run: |
          xcodebuild \
            -project MonoFocus.xcodeproj \
            -scheme MonoFocus \
            -destination 'platform=iOS Simulator,name=iPhone 14,OS=17.0' \
            CODE_SIGNING_ALLOWED=NO \
            | grep -E 'warning:' && exit 1 || exit 0
        working-directory: ./MonoFocus
```

---

### **2. Add SwiftLint (Optional)**

**Install SwiftLint:**
```yaml
- name: Install SwiftLint
  run: brew install swiftlint

- name: Lint code
  run: swiftlint lint --strict
  working-directory: ./MonoFocus
```

**Create `.swiftlint.yml`:**
```yaml
disabled_rules:
  - trailing_whitespace
  - line_length

opt_in_rules:
  - force_unwrapping
  - force_cast

excluded:
  - Pods
  - .build

force_unwrapping:
  severity: error

force_cast:
  severity: error
```

---

### **3. Add Build Status Badge**

**Update README.md:**
```markdown
# MonoFocus

![Build Status](https://github.com/YOUR_USERNAME/MonoFocus/workflows/CI/badge.svg)

A frictionless, offline focus timer for iOS.
```

---

### **4. Configure Branch Protection**

**GitHub Settings → Branches → Add Rule:**
- Branch name pattern: `main`
- ☑ Require status checks to pass before merging
  - ☑ Status checks that are required:
    - `test` (Build and Test)
- ☑ Require branches to be up to date before merging

---

## 📋 Subtasks

- [ ] Create `.github/workflows/ci.yml`
- [ ] Test workflow locally with `act` (optional)
- [ ] Push to GitHub and verify workflow runs
- [ ] Fix any workflow errors
- [ ] Configure Codecov integration
- [ ] Add SwiftLint (optional)
- [ ] Add build status badge to README
- [ ] Configure branch protection rules
- [ ] Document CI/CD process in CONTRIBUTING.md

---

## 🧪 Testing CI Locally

Use `act` to test GitHub Actions locally:

```bash
# Install act
brew install act

# Run workflow
cd /Users/oleksandrbielov/dev/MonoFocus-Dev-Starter/MonoFocus
act -j test
```

---

## 📊 Expected CI Results

### **Successful Run**
```
✓ Checkout code
✓ Select Xcode version
✓ Show Xcode version
✓ Install XcodeGen
✓ Generate Xcode project
✓ Build for testing (2m 30s)
✓ Run tests (45s)
✓ Generate coverage report
✓ Upload coverage to Codecov
✓ Check for warnings

Total: 4m 20s
```

### **Coverage Report**
```
MonoFocus Test Coverage:
- TimerViewModel.swift: 85.3%
- NotificationService.swift: 78.2%
- ShortcutService.swift: 92.1%
- URLRouter.swift: 100.0%
─────────────────────────────
Overall: 68.4%
```

---

## 🔗 Related

- **Code Review:** Issue #8 (Medium Priority)
- **Files Created:**
  - `.github/workflows/ci.yml`
  - `.swiftlint.yml` (optional)
- **Dependencies:** MONO-003 to MONO-006 (tests must exist)

---

## ⚠️ Risks

- **GitHub Actions Minutes:** Free tier has 2,000 minutes/month (sufficient)
- **Xcode Version:** Must match project requirements (15.0+)
- **Simulator Availability:** May need to adjust iOS version based on runner

---

**Created:** November 5, 2025  
**Assignee:** DevOps / iOS Developer  
**Reviewer:** Tech Lead
