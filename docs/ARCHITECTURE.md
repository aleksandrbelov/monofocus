# ARCHITECTURE

## Frontend (iOS, SwiftUI)
- `TimerViewModel`: state machine for timer, persistence.
- `NotificationService`: local notifications.
- `ShortcutService`: launches user Shortcuts via URL scheme.
- `URLRouter`: handles `monofocus://start?minutes=…` deep links.
- `WidgetKit` extension: simple preset links.

## Data
- Minimal JSON file for session history (`Documents/sessions.json`).

## Privacy
- No analytics, no network calls, all on-device.
