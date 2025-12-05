import SwiftUI

struct TimerView: View {
    @EnvironmentObject var timer: TimerViewModel
    @EnvironmentObject var automation: AutomationService
    @EnvironmentObject var notifications: NotificationService
    @State private var showingSetup = false

    let presets = [25, 45, 90]

    var body: some View {
        NavigationStack {
            VStack(spacing: Theme.spacingXL) {
                Text(timer.formattedTime(timer.remainingSeconds))
                    .font(.system(size: 72, weight: .semibold, design: .rounded))
                    .monospacedDigit()
                    .accessibilityLabel("Remaining time")
                    .accessibilityValue(timer.formattedTime(timer.remainingSeconds))

                HStack(spacing: Theme.spacingM) {
                    ForEach(presets, id: \ .self) { m in
                        Button("\(m)m") { timer.setPreset(minutes: m) }
                            .buttonStyle(Pill())
                            .accessibilityHint("Set preset to \(m) minutes")
                    }
                }

                HStack(spacing: Theme.spacingM) {
                    if !timer.isRunning && !timer.isPaused {
                        Button("Start") {
                            timer.start(notificationService: notifications)
                            automation.notifySessionStart(durationMinutes: timer.totalSeconds / 60)
                        }
                            .buttonStyle(Primary())
                    } else if timer.isPaused {
                        Button("Resume") {
                            timer.resume(notificationService: notifications)
                            automation.notifySessionResume(remainingMinutes: timer.remainingSeconds / 60)
                        }
                            .buttonStyle(Primary())
                    } else {
                        Button("Pause") { timer.pause() }
                            .buttonStyle(Secondary())
                    }

                    Button("Stop") { timer.stop(save: true) }
                        .buttonStyle(Secondary())
                        .disabled(!timer.isRunning && !timer.isPaused)
                }

                VStack(spacing: Theme.spacingM) {
                    HStack {
                        Text("Automation")
                            .font(.headline)
                        Spacer()
                    }


                    Toggle("Enable Focus Automations", isOn: $automation.isAutomationEnabled)

                    Text("Your shortcuts will run when sessions start and end. Configure them in Settings → Setup Automations.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer(minLength: 0)
            }
            .padding()
            .navigationTitle("MonoFocus")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showingSetup = true
                    } label: {
                        Image(systemName: "questionmark.circle")
                    }
                    .accessibilityLabel("Setup help")
                }
            }
            .sheet(isPresented: $showingSetup) {
                SetupView()
            }
        }
    }
}

struct Pill: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body.weight(.medium))
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(.thinMaterial)
            .clipShape(Capsule())
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
    }
}

struct Primary: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.title3.weight(.semibold))
            .padding(.horizontal, 24)
            .padding(.vertical, 14)
            .background(Color.primary.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous))
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
    }
}

struct Secondary: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body.weight(.medium))
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous)
                    .strokeBorder(Color.primary.opacity(0.2), lineWidth: 1)
            )
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
    }
}
