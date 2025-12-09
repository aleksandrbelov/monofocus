#if canImport(ActivityKit)
import ActivityKit
import WidgetKit
import SwiftUI
import AppIntents

@available(iOSApplicationExtension 16.1, *)
struct TimerLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TimerAttributes.self) { context in
            // Lock Screen View
            TimerLiveActivityLockScreenView(context: context)
        } dynamicIsland: { context in
             DynamicIsland {
                 // Expanded UI
                 DynamicIslandExpandedRegion(.bottom) {
                     TimerActivityExpandedView(context: context)
                 }
             } compactLeading: {
                 TimerActivityCompactLeadingView(context: context)
             } compactTrailing: {
                 TimerActivityCompactTrailingView(context: context)
             } minimal: {
                 TimerActivityMinimalView(context: context)
             }
         }
    }
}

// MARK: - Colors
// Matches specific design requirements (hex values from React ref)
struct TimerActivityColors {
    // Shared
    static let primaryText = Color.white
    static let secondaryText = Color(red: 174/255, green: 174/255, blue: 178/255) // #AEAEB2
    static let tertiaryText = Color(red: 142/255, green: 142/255, blue: 147/255, opacity: 0.4) // #8E8E93 (approx)
    
    // Light/Dark adaptive colors for Lock Screen
    // Note: Live Activities on Lock Screen effectively use a "dark mode" style material 
    // or adapt to system. We'll use the specific values for "Dark" mode 
    // as Live Activities are typically dark on Lock Screen, but we can make them adaptive.
    // The design ref has explicit light/dark modes. We will stick to the Dark palette 
    // defaults for the Dynamic Island (always black) and adaptive for Lock Screen.
    
    static func background(for scheme: ColorScheme) -> Color {
        scheme == .light ? Color(red: 255/255, green: 255/255, blue: 255/255, opacity: 0.85) : Color(red: 28/255, green: 28/255, blue: 30/255, opacity: 0.85)
    }
    
    static func primaryText(for scheme: ColorScheme) -> Color {
        scheme == .light ? .black : .white
    }
    
    static func secondaryText(for scheme: ColorScheme) -> Color {
        scheme == .light ? Color(red: 60/255, green: 60/255, blue: 67/255) : Color(red: 174/255, green: 174/255, blue: 178/255)
    }
    
    static func tertiaryText(for scheme: ColorScheme) -> Color {
        scheme == .light ? Color(red: 60/255, green: 60/255, blue: 67/255, opacity: 0.6) : Color(red: 174/255, green: 174/255, blue: 178/255, opacity: 0.4)
    }

    static func progressTrack(for scheme: ColorScheme) -> Color {
        scheme == .light ? Color(red: 229/255, green: 229/255, blue: 234/255) : Color(red: 44/255, green: 44/255, blue: 46/255)
    }
    
    // Constants
    static let accent = Color(red: 10/255, green: 132/255, blue: 255/255) // #0A84FF
    static let paused = Color(red: 255/255, green: 159/255, blue: 10/255) // #FF9F0A
    
    static func buttonBackground(for scheme: ColorScheme) -> Color {
        scheme == .light ? Color.black.opacity(0.05) : Color.white.opacity(0.15)
    }
    
    static let destructiveButtonBackground = Color(red: 255/255, green: 59/255, blue: 48/255, opacity: 0.2)
    static let destructiveText = Color(red: 255/255, green: 69/255, blue: 58/255) // #FF453A
}

// MARK: - Lock Screen View (Standard = Expanded Card)

@available(iOSApplicationExtension 16.1, *)
private struct TimerLiveActivityLockScreenView: View {
    let context: ActivityViewContext<TimerAttributes>
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        VStack(spacing: 0) {
            // Header
//            HStack(alignment: .center) {
//                HStack(spacing: 6) {
//                    Text("MonoFocus")
//                        .font(.system(size: 15, weight: .semibold))
//                        .foregroundColor(TimerActivityColors.primaryText(for: colorScheme))
//                    
//                    if context.attributes.isAutomation {
//                        HStack(spacing: 2) {
//                            Image(systemName: "bolt.fill")
//                                .font(.system(size: 8))
//                            Text("AUTO")
//                                .font(.system(size: 9, weight: .bold))
//                        }
//                        .padding(.horizontal, 4)
//                        .padding(.vertical, 2)
//                        .background(TimerActivityColors.accent)
//                        .foregroundColor(.white)
//                        .cornerRadius(6)
//                    }
//                }
//                
//                Spacer()
//                
//                Text(context.state.isPaused ? "Paused" : "In Progress")
//                    .font(.system(size: 13, weight: .medium))
//                    .foregroundColor(context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent)
//            }
//            .padding(.bottom, 16).padding(.top, 16)
            
            // Main Content
            HStack(spacing: 20) {
                // Progress Ring
                ZStack {
                    Circle()
                        .stroke(TimerActivityColors.progressTrack(for: colorScheme), lineWidth: 6)
                        .frame(width: 68, height: 68)
                    
                    Circle()
                        .trim(from: 0, to: context.progress)
                        .stroke(
                            context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent,
                            style: StrokeStyle(lineWidth: 6, lineCap: .round, dash: context.state.isPaused ? [8, 4] : [])
                        )
                        .rotationEffect(.degrees(-90))
                        .frame(width: 68, height: 68)
                    
                    VStack(spacing: 0) {
//                        Text(context.format(seconds: context.state.remainingSeconds))
//                            .font(.system(size: 20, weight: .semibold, design: .rounded))
//                            .monospacedDigit()
//                            .foregroundColor(TimerActivityColors.primaryText(for: colorScheme))
                        
                        if context.state.isPaused {
                            Image(systemName: "pause.fill")
                                .font(.system(size: 12))
                                .foregroundColor(TimerActivityColors.secondaryText(for: colorScheme))
                                .padding(.top, 2)
                        }
                    }
                }
                
                // Info
                VStack(alignment: .leading, spacing: 4) {
                    Text(context.attributes.sessionType ?? "Deep Focus")
                        .font(.system(size: 22, weight: .semibold))
                        .foregroundColor(TimerActivityColors.primaryText(for: colorScheme))
                    
//                    Text("\(Int(context.progress * 100))% complete")
//                        .font(.system(size: 15))
//                        .foregroundColor(TimerActivityColors.secondaryText(for: colorScheme))
                    
                    Text(context.state.isPaused ? "Paused" : "In Progress")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent)
                    
                    Text("Ends at \(context.state.endDate.formatted(date: .omitted, time: .shortened))")
                        .font(.system(size: 13))
                        .foregroundColor(TimerActivityColors.tertiaryText(for: colorScheme))
                }
                
                VStack(spacing: 0) {
                    Text(context.format(seconds: context.state.remainingSeconds))
                        .font(.system(size: 20, weight: .semibold, design: .rounded))
                        .monospacedDigit()
                        .foregroundColor(TimerActivityColors.primaryText(for: colorScheme))
                    Text("\(Int(context.progress * 100))% complete")
                        .font(.system(size: 15))
                        .foregroundColor(TimerActivityColors.secondaryText(for: colorScheme))
//                    if context.state.isPaused {
//                        Image(systemName: "pause.fill")
//                            .font(.system(size: 12))
//                            .foregroundColor(TimerActivityColors.secondaryText(for: colorScheme))
//                            .padding(.top, 2)
//                    }
                }
                Spacer()
            }
            .padding(.bottom, 10)
            
            // Action Buttons
            HStack(spacing: 8) {
                // Pause/Resume
                if context.state.isPaused {
                    Button(intent: ResumeFocusSessionIntent()) {
                        HStack {
                            Image(systemName: "play.fill")
                            Text("Resume")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(TimerActivityColors.buttonBackground(for: colorScheme))
                        .foregroundColor(TimerActivityColors.primaryText(for: colorScheme))
                        .cornerRadius(12)
                    }
                    .buttonStyle(.plain)
                } else {
                    Button(intent: PauseFocusSessionIntent()) {
                        HStack {
                            Image(systemName: "pause.fill")
                            Text("Pause")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(TimerActivityColors.buttonBackground(for: colorScheme))
                        .foregroundColor(TimerActivityColors.primaryText(for: colorScheme))
                        .cornerRadius(12)
                    }
                    .buttonStyle(.plain)
                }
                
                // End
                Button(intent: StopTimerIntent()) {
                    HStack {
                        Image(systemName: "stop.fill")
                        Text("End")
                            .fontWeight(.semibold)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(TimerActivityColors.destructiveButtonBackground)
                    .foregroundColor(TimerActivityColors.destructiveText)
                    .cornerRadius(12)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(20)
        .background(TimerActivityColors.background(for: colorScheme))
        // Replicating "Material" not directly possible in vanilla View without `Privacy-Sensitive` hacks or system background 
        // but ActivityConfiguration allows system materials. 
        // We'll trust the system background mostly or use the color provided.
    }
}


// MARK: - Dynamic Island Views

@available(iOSApplicationExtension 16.1, *)
private struct TimerActivityCompactLeadingView: View {
    let context: ActivityViewContext<TimerAttributes>

    var body: some View {
        HStack(spacing: 4) {
             ZStack {
                Circle()
                    .stroke(TimerActivityColors.progressTrack(for: .dark), lineWidth: 2)
                    .frame(width: 22, height: 22)

                Circle()
                    .trim(from: 0, to: context.progress)
                    .stroke(context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent, style: StrokeStyle(lineWidth: 2, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                    .frame(width: 22, height: 22)
                 
                if context.state.isPaused {
                     Image(systemName: "pause.fill")
                        .font(.system(size: 8))
                        .foregroundColor(TimerActivityColors.paused)
                }
            }
            
            Text("MonoFocus")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundColor(.white)
        }
        .padding(.leading, 6)
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct TimerActivityCompactTrailingView: View {
    let context: ActivityViewContext<TimerAttributes>

    var body: some View {
        Text(context.format(seconds: context.state.remainingSeconds))
            .font(.callout)
            .monospacedDigit()
            .fontWeight(.semibold)
            .foregroundColor(context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent)
            .padding(.trailing, 6)
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct TimerActivityMinimalView: View {
    let context: ActivityViewContext<TimerAttributes>

    var body: some View {
        ZStack {
            Circle()
                .stroke(TimerActivityColors.progressTrack(for: .dark), lineWidth: 2)
                // Minimal view size is handled by system, but we provide content
            
            Circle()
                .trim(from: 0, to: context.progress)
                .stroke(context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent, style: StrokeStyle(lineWidth: 2, lineCap: .round))
                .rotationEffect(.degrees(-90))
            
            Image(systemName: context.state.isPaused ? "pause.fill" : "timer")
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent)
        }
        .padding(2)
    }
}

@available(iOSApplicationExtension 16.1, *)
private struct TimerActivityExpandedView: View {
    let context: ActivityViewContext<TimerAttributes>
    // Expanded is always dark context in Dynamic Island
    let colorScheme: ColorScheme = .dark 

    var body: some View {
        VStack(spacing: 0) {
            // Header
//            HStack(alignment: .center) {
//                HStack(spacing: 6) {
//                    // Automation Badge
//                    if context.attributes.isAutomation {
//                         Image(systemName: "bolt.fill")
//                            .font(.system(size: 10))
//                            .foregroundColor(TimerActivityColors.accent)
//                    }
//                    Text("MonoFocus")
//                        .font(.system(size: 13, weight: .semibold))
//                        .foregroundColor(TimerActivityColors.secondaryText(for: .dark))
//                }
//                
//                Spacer()
//                
//                Text(context.state.isPaused ? "Paused" : "In Progress")
//                    .font(.caption)
//                    .fontWeight(.medium)
//                    .foregroundColor(context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent)
//            }
//            .padding(.bottom, 12)
            
            // Main Content (Similar to Lock Screen but tighter)
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .stroke(TimerActivityColors.progressTrack(for: .dark), lineWidth: 5)
                        .frame(width: 52, height: 52)
                    
                    Circle()
                        .trim(from: 0, to: context.progress)
                        .stroke(
                            context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent,
                            style: StrokeStyle(lineWidth: 5, lineCap: .round, dash: context.state.isPaused ? [6, 3] : [])
                        )
                        .rotationEffect(.degrees(-90))
                        .frame(width: 52, height: 52)
                    
//                    Text(context.format(seconds: context.state.remainingSeconds))
//                        .font(.system(size: 16, weight: .semibold, design: .rounded))
//                        .monospacedDigit()
//                        .foregroundColor(.white)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(context.attributes.sessionType ?? "Deep Focus")
                        .font(.headline)
                        .foregroundColor(.white)
                    
                    Text(context.state.isPaused ? "Paused" : "In Progress")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(context.state.isPaused ? TimerActivityColors.paused : TimerActivityColors.accent)
                    
                    Text("\(Int(context.progress * 100))% · Ends \(context.state.endDate.formatted(date: .omitted, time: .shortened))")
                         .font(.caption2)
                         .foregroundColor(TimerActivityColors.secondaryText(for: .dark))
                }
                
                Spacer()
                
                VStack{
                    Text(context.format(seconds: context.state.remainingSeconds))
                        .font(.system(size: 16, weight: .semibold, design: .rounded))
                        .monospacedDigit()
                        .foregroundColor(.white)
                    Text("remaining")
                        .font(.system(size: 15))
                        .foregroundColor(TimerActivityColors.secondaryText(for: colorScheme))
                    
                }
            }
            .padding(.bottom, 10)
            
            // Buttons
             HStack(spacing: 8) {
                // Pause/Resume
                if context.state.isPaused {
                    Button(intent: ResumeFocusSessionIntent()) {
                        Label("Resume", systemImage: "play.fill")
                            .font(.system(size: 14, weight: .semibold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(TimerActivityColors.buttonBackground(for: .dark))
                            .foregroundColor(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)
                } else {
                    Button(intent: PauseFocusSessionIntent()) {
                        Label("Pause", systemImage: "pause.fill")
                            .font(.system(size: 14, weight: .semibold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(TimerActivityColors.buttonBackground(for: .dark))
                            .foregroundColor(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)
                }
                
                // End
                Button(intent: StopTimerIntent()) {
                    Label("End Session", systemImage: "stop.fill")
                        .font(.system(size: 14, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(TimerActivityColors.destructiveButtonBackground)
                        .foregroundColor(TimerActivityColors.destructiveText)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 8)
    }
}

// MARK: - Utilities

@available(iOSApplicationExtension 16.1, *)
extension ActivityViewContext<TimerAttributes> {
    var progress: Double {
        let total = Double(attributes.totalSeconds)
        let remaining = Double(state.remainingSeconds)
        return total > 0 ? max(0, min(1, (total - remaining) / total)) : 0
    }

    func format(seconds: Int) -> String {
        let m = seconds / 60
        let s = seconds % 60
        return String(format: "%02d:%02d", m, s)
    }
}

// MARK: - App Intents Stubs
// These align with the AppIntents found in the main app, but we stub them if the compiler doesn't find them shared.
// However, assuming they are shared or this file is targeted correctly. If stubs are needed:

#if canImport(AppIntents)
// Assuming intents are available via a shared target or these stubs are placeholders until linked.
// The previous file had them defined in the file. We should keep them to avoid errors.

struct PauseFocusSessionIntent: AppIntent {
    static var title: LocalizedStringResource = "Pause Focus Timer"
    static var openAppWhenRun: Bool = false // Interactive Live Activities often run in background
    func perform() async throws -> some IntentResult { return .result() }
}

struct ResumeFocusSessionIntent: AppIntent {
    static var title: LocalizedStringResource = "Resume Focus Timer"
    static var openAppWhenRun: Bool = false
    func perform() async throws -> some IntentResult { return .result() }
}

struct StopTimerIntent: AppIntent {
    static var title: LocalizedStringResource = "Stop Focus Timer"
    static var openAppWhenRun: Bool = false
    func perform() async throws -> some IntentResult { return .result() }
}
#endif
#endif
