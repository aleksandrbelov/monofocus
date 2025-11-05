import SwiftUI
import BackgroundTasks

@main
struct MonoFocusApp: App {
    @StateObject private var timerVM: TimerViewModel
    @StateObject private var shortcutService: ShortcutService
    @StateObject private var notificationService: NotificationService
    @StateObject private var themeManager: ThemeManager
    @Environment(\.scenePhase) private var scenePhase

    init() {
        let timerViewModel = TimerViewModel()
        let shortcutService = ShortcutService()
        let notificationService = NotificationService()
        let themeManager = ThemeManager()
        _timerVM = StateObject(wrappedValue: timerViewModel)
        _shortcutService = StateObject(wrappedValue: shortcutService)
        _notificationService = StateObject(wrappedValue: notificationService)
        _themeManager = StateObject(wrappedValue: themeManager)

        BGTaskScheduler.shared.register(forTaskWithIdentifier: TimerViewModel.backgroundTaskIdentifier, using: nil) { task in
            guard let processingTask = task as? BGProcessingTask else {
                task.setTaskCompleted(success: false)
                return
            }
            Task {
                await MainActor.run {
                    timerViewModel.handleBackgroundProcessing(task: processingTask)
                }
            }
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(timerVM)
                .environmentObject(shortcutService)
                .environmentObject(notificationService)
                .environmentObject(themeManager)
                .onOpenURL { url in
                    URLRouter.handle(url: url, timerVM: timerVM)
                }
                .task {
                    await notificationService.requestAuthorizationIfNeeded()
                    await MainActor.run {
                        timerVM.handleSceneDidBecomeActive(notificationService: notificationService)
                    }
                }
                .onReceive(NotificationCenter.default.publisher(for: .timerSessionCompleted)) { _ in
                    // Mark and attempt to run "off" automations when timer ends.
                    shortcutService.markPendingOffIfEnabled()
                    shortcutService.drainPendingOffIfAny(onlyIfActive: true)
                }
                .onChange(of: scenePhase) { newPhase in
                    switch newPhase {
                    case .background:
                        timerVM.prepareForBackground()
                    case .active:
                        timerVM.handleSceneDidBecomeActive(notificationService: notificationService)
                        // Drain any pending off automations when returning to foreground.
                        shortcutService.drainPendingOffIfAny(onlyIfActive: false)
                    case .inactive:
                        timerVM.persistState()
                    @unknown default:
                        timerVM.persistState()
                    }
                }
        }
    }
}
