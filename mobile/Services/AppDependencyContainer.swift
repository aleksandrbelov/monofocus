import Foundation

/// Singleton container for injecting services into App Intents.
/// App Intents are instantiated by the system without access to SwiftUI environment,
/// so this container provides a way to access shared services.
@MainActor
final class AppDependencyContainer {
    static let shared = AppDependencyContainer()

    private(set) var timerViewModel: TimerViewModel?
    private(set) var notificationService: NotificationService?
    private(set) var automationService: AutomationService?

    private init() {}

    /// Configure the container with service instances. Call this from the app entry point.
    func configure(
        timerViewModel: TimerViewModel,
        notificationService: NotificationService,
        automationService: AutomationService
    ) {
        self.timerViewModel = timerViewModel
        self.notificationService = notificationService
        self.automationService = automationService
    }
}
