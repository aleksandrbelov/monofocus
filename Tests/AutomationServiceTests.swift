import XCTest
@testable import MonoFocus

final class AutomationServiceTests: XCTestCase {
    @MainActor func test_toggle_persistsToUserDefaults() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let service = AutomationService(userDefaults: defaults)

        // Verify initial state is false
        XCTAssertFalse(service.isAutomationEnabled)
        XCTAssertFalse(defaults.bool(forKey: "automationEnabled"))

        // Enable automation
        service.isAutomationEnabled = true
        XCTAssertTrue(defaults.bool(forKey: "automationEnabled"))

        // Disable automation
        service.isAutomationEnabled = false
        XCTAssertFalse(defaults.bool(forKey: "automationEnabled"))
    }

    @MainActor func test_notifySessionStart_skipsWhenDisabled() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let service = AutomationService(userDefaults: defaults)
        service.isAutomationEnabled = false

        // This should not throw or crash when automation is disabled
        service.notifySessionStart(durationMinutes: 25)
    }

    @MainActor func test_notifySessionComplete_skipsWhenDisabled() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let service = AutomationService(userDefaults: defaults)
        service.isAutomationEnabled = false

        // This should not throw or crash when automation is disabled
        service.notifySessionComplete(elapsedMinutes: 25)
    }

    @MainActor func test_restoredState_fromUserDefaults() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        defaults.set(true, forKey: "automationEnabled")

        let service = AutomationService(userDefaults: defaults)

        XCTAssertTrue(service.isAutomationEnabled)
    }
}
