import SwiftUI
import BackgroundTasks

@main
struct MonoFocusApp: App {
    @StateObject private var timerVM: TimerViewModel
    @StateObject private var automationService: AutomationService
    @StateObject private var notificationService: NotificationService
    @StateObject private var themeManager: ThemeManager
    @Environment(\.scenePhase) private var scenePhase

    init() {
        let timerViewModel = TimerViewModel()
        let automationService = AutomationService()
        let notificationService = NotificationService()
        let themeManager = ThemeManager()
        _timerVM = StateObject(wrappedValue: timerViewModel)
        _automationService = StateObject(wrappedValue: automationService)
        _notificationService = StateObject(wrappedValue: notificationService)
        _themeManager = StateObject(wrappedValue: themeManager)

        // Configure the dependency container for App Intents
        Task { @MainActor in
            AppDependencyContainer.shared.configure(
                timerViewModel: timerViewModel,
                notificationService: notificationService,
                automationService: automationService
            )
        }

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
                .environmentObject(automationService)
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
                    // Notify automation service when timer ends.
                    automationService.notifySessionComplete(elapsedMinutes: timerVM.totalSeconds / 60)
                }
                .onChange(of: scenePhase) { newPhase in
                    switch newPhase {
                    case .background:
                        timerVM.prepareForBackground()
                    case .active:
                        timerVM.handleSceneDidBecomeActive(notificationService: notificationService)
                    case .inactive:
                        timerVM.persistState()
                    @unknown default:
                        timerVM.persistState()
                    }
                }
        }
    }
}
