import Foundation
import UserNotifications

@MainActor
final class NotificationService: ObservableObject {
    @Published var permissionGranted = false

    func requestAuthorizationIfNeeded() async {
        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        if settings.authorizationStatus == .notDetermined {
            do {
                permissionGranted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            } catch {
                permissionGranted = false
            }
        } else {
            permissionGranted = settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional
        }
    }

    func scheduleEndOfSessionNotification(inSeconds: TimeInterval) async {
        guard permissionGranted else { return }
        let content = UNMutableNotificationContent()
        content.title = "Session complete"
        content.body = "Nice work. Time to breathe."
        content.sound = UNNotificationSound.default

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: max(1, inSeconds), repeats: false)
        let req = UNNotificationRequest(identifier: "end-of-session", content: content, trigger: trigger)
        do {
            try await UNUserNotificationCenter.current().add(req)
        } catch {
            // ignore for MVP
        }
    }
}
