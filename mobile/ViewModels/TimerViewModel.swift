import Foundation
import Combine
import UserNotifications
import UIKit
import BackgroundTasks
#if canImport(ActivityKit)
import ActivityKit
#endif
extension Notification.Name {
    static let timerSessionCompleted = Notification.Name("TimerSessionCompleted")
}

@MainActor
final class TimerViewModel: ObservableObject {
    static let backgroundTaskIdentifier = "dev.monofocus.app.timer-processing"

    @Published var totalSeconds: Int = 1500 // default 25m
    @Published var remainingSeconds: Int = 1500
    @Published var isRunning: Bool = false
    @Published var isPaused: Bool = false
    @Published var lastPreset: Int? = 25

    private var tickCancellable: AnyCancellable?
    private let storageURL: URL
    private let stateURL: URL
    private var sessionStartDate: Date?
    private var endDate: Date?
    private var liveActivityID: String?

    init() {
        let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        storageURL = dir.appendingPathComponent("sessions.json")
        stateURL = dir.appendingPathComponent("timer-state.json")
        restoreState()
#if canImport(ActivityKit)
        if #available(iOS 16.1, *) {
            liveActivityID = Activity<TimerAttributes>.activities.first?.id
            updateLiveActivitySnapshot()
        }
#endif
    }

    func setPreset(minutes: Int) {
        guard !isRunning else { return }
        totalSeconds = minutes * 60
        remainingSeconds = totalSeconds
        lastPreset = minutes
        sessionStartDate = nil
        endDate = nil
        persistState()
    }

    func start(notificationService: NotificationService? = nil) {
        guard !isRunning else { return }
        if sessionStartDate == nil {
            sessionStartDate = Date()
        }
        isRunning = true
        isPaused = false
        endDate = Date().addingTimeInterval(TimeInterval(remainingSeconds))
        scheduleTick()
        scheduleEndNotification(using: notificationService)
        scheduleBackgroundProcessing()
        persistState()
#if canImport(ActivityKit)
        updateLiveActivitySnapshot()
#endif
    }

    func pause() {
        guard isRunning else { return }
        syncRemainingWithClock(shouldFinalize: true, triggerHaptics: false)
        isPaused = true
        isRunning = false
        tickCancellable?.cancel()
        endDate = nil
        cancelBackgroundProcessing()
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["end-of-session"])
        persistState()
#if canImport(ActivityKit)
        updateLiveActivitySnapshot()
#endif
    }

    func resume(notificationService: NotificationService? = nil) {
        guard !isRunning && isPaused else { return }
        isRunning = true
        isPaused = false
        endDate = Date().addingTimeInterval(TimeInterval(remainingSeconds))
        scheduleTick()
        scheduleEndNotification(using: notificationService)
        scheduleBackgroundProcessing()
        persistState()
#if canImport(ActivityKit)
        updateLiveActivitySnapshot()
#endif
    }

    func stop(save: Bool = false) {
        syncRemainingWithClock(shouldFinalize: true, triggerHaptics: false)
        isRunning = false
        isPaused = false
        tickCancellable?.cancel()
        cancelBackgroundProcessing()
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["end-of-session"])
        if save {
            let elapsed = totalSeconds - remainingSeconds
            persistSession(completed: remainingSeconds == 0, elapsedSeconds: max(elapsed, 0))
        }
        sessionStartDate = nil
        endDate = nil
        remainingSeconds = totalSeconds
        persistState()
#if canImport(ActivityKit)
        endLiveActivity(dismissImmediately: true)
#endif
    }

    func prepareForBackground() {
        if isRunning {
            syncRemainingWithClock(shouldFinalize: true, triggerHaptics: false)
            tickCancellable?.cancel()
            scheduleBackgroundProcessing()
        }
        persistState()
    }

    func handleSceneDidBecomeActive(notificationService: NotificationService? = nil) {
        syncRemainingWithClock(shouldFinalize: true, triggerHaptics: false)
        if isRunning {
            scheduleTick()
            scheduleEndNotification(using: notificationService)
            scheduleBackgroundProcessing()
        } else {
            cancelBackgroundProcessing()
        }
        persistState()
#if canImport(ActivityKit)
        updateLiveActivitySnapshot()
#endif
    }

    func handleBackgroundProcessing(task: BGProcessingTask) {
        guard isRunning else {
#if canImport(ActivityKit)
            updateLiveActivitySnapshot()
#endif
            task.setTaskCompleted(success: true)
            return
        }

        task.expirationHandler = { [weak self] in
            self?.persistState()
            task.setTaskCompleted(success: false)
        }

        syncRemainingWithClock(shouldFinalize: true, triggerHaptics: false)
        persistState()

        if isRunning {
            scheduleBackgroundProcessing()
        } else {
            cancelBackgroundProcessing()
        }

#if canImport(ActivityKit)
        updateLiveActivitySnapshot()
#endif
        task.setTaskCompleted(success: true)
    }

    private func scheduleTick() {
        tickCancellable?.cancel()
        guard endDate != nil else { return }
        tickCancellable = Timer.publish(every: 1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.syncRemainingWithClock(shouldFinalize: true, triggerHaptics: true)
            }
    }

    private func syncRemainingWithClock(shouldFinalize: Bool, triggerHaptics: Bool) {
        guard let target = endDate else { return }
        let newRemaining = max(0, Int(ceil(target.timeIntervalSinceNow)))
        if newRemaining != remainingSeconds {
            remainingSeconds = newRemaining
        }
        if newRemaining <= 0 && shouldFinalize {
            finishCurrentSession(triggerHaptics: triggerHaptics)
        }
    }

    private func finishCurrentSession(triggerHaptics: Bool) {
        guard isRunning else { return }
        isRunning = false
        isPaused = false
        tickCancellable?.cancel()
        cancelBackgroundProcessing()
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["end-of-session"])
        remainingSeconds = 0
        persistSession(completed: true, elapsedSeconds: totalSeconds)
        sessionStartDate = nil
        endDate = nil
        persistState()
#if canImport(ActivityKit)
        endLiveActivity(dismissImmediately: true)
#endif
        if triggerHaptics {
            Haptics.timerComplete()
        }
        // Inform observers (e.g., automation service) that the session completed.
        NotificationCenter.default.post(name: .timerSessionCompleted, object: nil)
    }

    private func scheduleEndNotification(using notificationService: NotificationService?) {
        guard remainingSeconds > 0 else { return }
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["end-of-session"])
        Task {
            await notificationService?.scheduleEndOfSessionNotification(inSeconds: TimeInterval(remainingSeconds))
        }
    }

    private func scheduleBackgroundProcessing() {
        guard isRunning else { return }
        cancelBackgroundProcessing()
        let request = BGProcessingTaskRequest(identifier: Self.backgroundTaskIdentifier)
        request.requiresNetworkConnectivity = false
        request.requiresExternalPower = false
        if let endDate {
            request.earliestBeginDate = endDate.addingTimeInterval(-60)
        }
        try? BGTaskScheduler.shared.submit(request)
    }

    private func cancelBackgroundProcessing() {
        BGTaskScheduler.shared.cancel(taskRequestWithIdentifier: Self.backgroundTaskIdentifier)
    }

#if canImport(ActivityKit)
    private func updateLiveActivitySnapshot() {
        guard #available(iOS 16.1, *) else { return }

        let fallbackEnd = Date().addingTimeInterval(TimeInterval(max(remainingSeconds, 0)))
        let activityEndDate = endDate ?? fallbackEnd
        let attributes = TimerAttributes(totalSeconds: totalSeconds, presetLabel: lastPreset.map { "\($0)m" })
        let state = TimerAttributes.ContentState(
            remainingSeconds: max(remainingSeconds, 0),
            isPaused: isPaused,
            endDate: activityEndDate
        )

        if isRunning || isPaused {
            Task { @MainActor [state, attributes] in
                if
                    let id = liveActivityID,
                    let currentActivity = Activity<TimerAttributes>.activities.first(where: { $0.id == id })
                {
                    if #available(iOS 16.2, *) {
                        await currentActivity.update(ActivityContent(state: state, staleDate: nil))
                    } else {
                        await currentActivity.update(using: state)
                    }
                } else {
                    do {
                        let activity = try Activity<TimerAttributes>.request(attributes: attributes, contentState: state, pushType: nil)
                        liveActivityID = activity.id
                    } catch {
                        // Ignore failures; Live Activity is an enhancement.
                        liveActivityID = nil
                    }
                }
            }
        } else {
            endLiveActivity(dismissImmediately: false)
        }
    }

    private func endLiveActivity(dismissImmediately: Bool) {
        guard #available(iOS 16.1, *) else { return }
        guard
            let id = liveActivityID,
            let activity = Activity<TimerAttributes>.activities.first(where: { $0.id == id })
        else {
            liveActivityID = nil
            return
        }
        liveActivityID = nil
        Task {
            try? await activity.end(dismissalPolicy: dismissImmediately ? .immediate : .default)
        }
    }
#endif

    func formattedTime(_ seconds: Int) -> String {
        let m = seconds / 60
        let s = seconds % 60
        return String(format: "%02d:%02d", m, s)
    }

    // MARK: - Persistence

    private func persistSession(completed: Bool, elapsedSeconds: Int) {
        let clampedElapsed = max(elapsedSeconds, 0)
        let start = sessionStartDate ?? Date().addingTimeInterval(TimeInterval(-clampedElapsed))
        let session = FocusSession(
            id: UUID(),
            start: start,
            durationSeconds: clampedElapsed,
            presetLabel: lastPreset.map { "\($0)m" },
            completed: completed
        )
        var arr = (try? JSONDecoder().decode([FocusSession].self, from: Data(contentsOf: storageURL))) ?? []
        arr.append(session)
        if let data = try? JSONEncoder().encode(arr) {
            try? data.write(to: storageURL)
        }
    }

    func persistState() {
        var state: [String: Any] = [
            "total": totalSeconds,
            "remaining": remainingSeconds,
            "running": isRunning,
            "paused": isPaused
        ]
        if let lastPreset {
            state["lastPreset"] = lastPreset
        }
        if let endDate {
            state["endDate"] = endDate.timeIntervalSince1970
        }
        if let sessionStartDate {
            state["sessionStart"] = sessionStartDate.timeIntervalSince1970
        }
        if let data = try? JSONSerialization.data(withJSONObject: state, options: []) {
            try? data.write(to: stateURL)
        }
    }

    private func restoreState() {
        guard
            let data = try? Data(contentsOf: stateURL),
            let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
        else { return }
        totalSeconds = json["total"] as? Int ?? 1500
        remainingSeconds = json["remaining"] as? Int ?? totalSeconds
        isRunning = json["running"] as? Bool ?? false
        isPaused = json["paused"] as? Bool ?? false
        lastPreset = json["lastPreset"] as? Int ?? lastPreset

        if let endInterval = json["endDate"] as? Double {
            endDate = Date(timeIntervalSince1970: endInterval)
        }
        if let startInterval = json["sessionStart"] as? Double {
            sessionStartDate = Date(timeIntervalSince1970: startInterval)
        }

        if isRunning {
            if endDate == nil {
                isRunning = false
            } else {
                syncRemainingWithClock(shouldFinalize: true, triggerHaptics: false)
            }
        }
#if canImport(ActivityKit)
        updateLiveActivitySnapshot()
#endif
    }

    // Expose sessions for export
    func loadSessions() -> [FocusSession] {
        guard let data = try? Data(contentsOf: storageURL) else { return [] }
        return (try? JSONDecoder().decode([FocusSession].self, from: data)) ?? []
    }
}

enum Haptics {
    static func selection() {
        UISelectionFeedbackGenerator().selectionChanged()
    }

    static func toggleOn() {
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred(intensity: 0.8)
    }

    static func toggleOff() {
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred(intensity: 0.5)
    }

    static func timerStart() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred(intensity: 0.9)
    }

    static func timerPause() {
        UIImpactFeedbackGenerator(style: .light).impactOccurred(intensity: 0.6)
    }

    static func timerResume() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred(intensity: 0.8)
    }

    static func timerStop() {
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred(intensity: 0.7)
    }

    static func timerComplete() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }

    static func error() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.error)
    }
}
