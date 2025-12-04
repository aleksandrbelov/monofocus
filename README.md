# MonoFocus

A frictionless, offline focus timer for iOS. Single-screen timer with quick presets, App Intents for Siri control and automation, and Lock Screen widgets for 1-tap start.

## Requirements

- iOS 18.0+
- Xcode 15+
- XcodeGen (`brew install xcodegen`)

## Quick Start

1. Install Xcode 15+ and XcodeGen (`brew install xcodegen`).
2. `cd MonoFocus`
3. `xcodegen generate`
4. Open `MonoFocus.xcodeproj` and run on iPhone (iOS 18+).

### Siri Integration

Control MonoFocus with your voice:
- "Start a focus timer" - Start a 25-minute session
- "Stop my focus timer" - Stop the current session
- "Pause my focus timer" - Pause the current session
- "Resume my focus timer" - Resume a paused session

### Optional: Lock Screen Widgets
Add the **MonoFocus Presets** widget and use 15/30/60 minute quick-starts.

### Optional: Automations
MonoFocus uses App Intents to notify your Shortcuts automations when sessions start, resume, or complete. Create automations in the Shortcuts app to enable DND or grayscale during focus sessions.
