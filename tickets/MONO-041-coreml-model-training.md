# MONO-041: Core ML Model Training Pipeline

**Type:** Feature  
**Priority:** 🟢 Medium  
**Status:** Backlog  
**Estimate:** 8 hours  
**Sprint:** 5 (System Integration & Intelligence)

---

## 📝 Description

Train an on-device Core ML tabular regressor using CreateML to predict the optimal focus duration based on time-of-day, day-of-week, historical completion rates, and streak length.

---

## 🎯 Acceptance Criteria

- [ ] Training dataset schema documented (features + target)
- [ ] CreateML training script (`tools/train_duration_model.swift`) produces `.mlmodel`
- [ ] Model compiled to `.mlmodelc` and embedded in app bundle
- [ ] Prediction latency < 10 ms on iPhone SE (3rd gen)
- [ ] Model size < 500 KB
- [ ] Holdout accuracy ≥ 70 % (predicted bucket matches user's chosen bucket)
- [ ] Model version stored in `UserDefaults` for future update detection

---

## 📋 Feature Schema

| Feature | Type | Description |
|---------|------|-------------|
| `hourOfDay` | Double | 0–23 |
| `dayOfWeek` | Double | 0–6 (Sun=0) |
| `completionRateShort` | Double | 0.0–1.0 |
| `completionRateMedium` | Double | 0.0–1.0 |
| `completionRateLong` | Double | 0.0–1.0 |
| `currentStreak` | Double | 0–N |
| **target** `durationMinutes` | Double | 25 / 45 / 90 |

Training data sourced from anonymised session exports (opt-in beta testers only).

---

## ⚠️ Privacy Note

No session data leaves the device during inference. Training is done offline on opt-in beta tester exports. Shipping model baked into app bundle.

---

## 🔗 Related

- MONO-038 (Analytics service — provides inference input at runtime)
- MONO-042 (Swap heuristic engine with Core ML model)

---

**Created:** March 2026  
**Assignee:** iOS Engineer / ML  
**Sprint:** 5
