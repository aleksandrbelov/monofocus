import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var timer: TimerViewModel
    @EnvironmentObject private var themeManager: ThemeManager
    @EnvironmentObject private var shortcuts: ShortcutService
    @EnvironmentObject private var notifications: NotificationService

    @AppStorage("preferredPreset") private var preferredPreset: Int = 25

    @State private var showSetupSheet = false
    @State private var showCompletionModal = false
    @State private var showTimePicker = false
    @State private var showResumeDialog = false
    @State private var previousRemainingSeconds: Int = 0

    private var showsEmptyState: Bool {
        timer.remainingSeconds == 0 && !timer.isRunning && !timer.isPaused
    }

    private var hasActiveModal: Bool {
        showCompletionModal || showTimePicker || showResumeDialog
    }

    private var selectedTimeBinding: Binding<Int> {
        Binding(
            get: { timer.totalSeconds },
            set: { newValue in
                let minutes = max(newValue / 60, 1)
                preferredPreset = minutes
                timer.setPreset(minutes: minutes)
            }
        )
    }

    var body: some View {
        ZStack {
            Color.monoBackground.ignoresSafeArea()

            ScrollView(.vertical, showsIndicators: false) {
                VStack(alignment: .leading, spacing: Spacing.value(.xxl)) {
                    HeaderView {
                        showSetupSheet = true
                    }

                    CircularTimerView(
                        time: timer.remainingSeconds,
                        totalTime: max(timer.totalSeconds, 1),
                        isPaused: timer.isPaused,
                        isRunning: timer.isRunning
                    )

                    if showsEmptyState {
                        EmptyStateView()
                    }

                    VStack(alignment: .leading, spacing: Spacing.value(.md)) {
                        Text("Presets")
                            .font(Typography.font(.title3, weight: .semibold))
                            .foregroundStyle(Color.monoForeground)

                        PresetButtonGroup(
                            selectedTime: selectedTimeBinding,
                            isDisabled: timer.isRunning,
                            onCustomTap: { showTimePicker = true }
                        )
                    }

                    VStack(alignment: .leading, spacing: Spacing.value(.md)) {
                        Text("Controls")
                            .font(Typography.font(.title3, weight: .semibold))
                            .foregroundStyle(Color.monoForeground)

                        ControlButtonGroup(
                            isRunning: timer.isRunning,
                            isPaused: timer.isPaused,
                            onStart: {
                                timer.start(notificationService: notifications)
                                runEnabledAutomations()
                            },
                            onPause: { timer.pause() },
                            onResume: {
                                timer.resume(notificationService: notifications)
                                runEnabledAutomations()
                            },
                            onStop: { timer.stop(save: true) }
                        )
                    }

                    AutomationSection(service: shortcuts) {
                        showSetupSheet = true
                    }
                }
                .padding(.horizontal, Spacing.value(.xl))
                .padding(.top, Spacing.statusBarHeight + Spacing.value(.xxl))
                .padding(.bottom, Spacing.homeIndicatorHeight + Spacing.value(.xxl))
            }
            .accessibilityHidden(hasActiveModal)
        }
        .safeAreaInset(edge: .top) { StatusBarView() }
        .safeAreaInset(edge: .bottom) { HomeIndicatorView() }
        .preferredColorScheme(themeManager.colorScheme)
        .sheet(isPresented: $showSetupSheet) {
            SetupView()
                .environmentObject(timer)
                .environmentObject(shortcuts)
        }
        .onAppear {
            previousRemainingSeconds = timer.remainingSeconds
            if timer.isPaused && timer.remainingSeconds > 0 {
                showResumeDialog = true
            }
        }
        .onChange(of: timer.remainingSeconds) { newValue in
            if previousRemainingSeconds > 0 && newValue == 0 && !timer.isRunning && !timer.isPaused {
                showCompletionModal = true
            }
            previousRemainingSeconds = newValue
        }
        .overlay(modalsOverlay)
    }

    private func runEnabledAutomations() {
        if shortcuts.isDNDAutomationEnabled {
            shortcuts.runShortcut(named: shortcuts.dndShortcutName)
        }
        if shortcuts.isGrayscaleAutomationEnabled {
            shortcuts.runShortcut(named: shortcuts.grayscaleShortcutName)
        }
    }

    @ViewBuilder
    private var modalsOverlay: some View {
        ZStack {
            CompletionModal(isPresented: $showCompletionModal) { }

            TimePickerModal(
                isPresented: $showTimePicker,
                initialMinutes: preferredPreset,
                onConfirm: { minutes in
                    preferredPreset = minutes
                    timer.setPreset(minutes: minutes)
                },
                onCancel: {}
            )

            ResumeSessionDialog(
                isPresented: $showResumeDialog,
                remainingSeconds: timer.remainingSeconds,
                onResume: { timer.resume(notificationService: notifications) },
                onDiscard: { timer.stop(save: false) }
            )
        }
    }
}

#if DEBUG
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        let timer = TimerViewModel()
        let shortcuts = ShortcutService()
        let notifications = NotificationService()
        let themeManager = ThemeManager()

        return ContentView()
            .environmentObject(timer)
            .environmentObject(shortcuts)
            .environmentObject(notifications)
            .environmentObject(themeManager)
            .preferredColorScheme(.dark)
    }
}
#endif
