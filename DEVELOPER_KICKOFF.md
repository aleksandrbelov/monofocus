# DEVELOPER_KICKOFF

## Environment
- Xcode 15+
- iOS 16+ target
- SwiftUI + WidgetKit
- XcodeGen for project generation

## Setup
```bash
brew install xcodegen
cd MonoFocus
xcodegen generate
open MonoFocus.xcodeproj
```

## Sprint 1 (MVP, 1–2 days)
- Core timer (start/pause/resume/stop)
- Local notification for end-of-session
- Presets 25/45/90
- URL scheme `monofocus://start?minutes=`
- Static widget with quick-start links

## Sprint 2
- Setup screen with guided Shortcuts
- Persist simple session history
- Accessibility polish (Dynamic Type, VoiceOver hints)

## Sprint 3
- AppIntents for deeper widget/Shortcuts integration
- Live Activity for running timer (optional)
- In-app settings for haptic/sound options
