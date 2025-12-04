import XCTest
@testable import MonoFocus

final class AutomationServiceTests: XCTestCase {
    @MainActor func test_toggles_persistToUserDefaults() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let service = AutomationService(userDefaults: defaults)

        // Verify initial state is false
        XCTAssertFalse(service.isDNDAutomationEnabled)
        XCTAssertFalse(service.isGrayscaleAutomationEnabled)

        // Enable DND automation
        service.isDNDAutomationEnabled = true
        XCTAssertTrue(defaults.bool(forKey: "dndAutomationEnabled"))

        // Enable Grayscale automation
        service.isGrayscaleAutomationEnabled = true
        XCTAssertTrue(defaults.bool(forKey: "grayscaleAutomationEnabled"))

        // Disable DND automation
        service.isDNDAutomationEnabled = false
        XCTAssertFalse(defaults.bool(forKey: "dndAutomationEnabled"))
    }

    @MainActor func test_notifySessionStart_skipsWhenDisabled() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let service = AutomationService(userDefaults: defaults)
        service.isDNDAutomationEnabled = false
        service.isGrayscaleAutomationEnabled = false

        // This should not throw or crash when both automations are disabled
        service.notifySessionStart(durationMinutes: 25)
    }

    @MainActor func test_notifySessionComplete_skipsWhenDisabled() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let service = AutomationService(userDefaults: defaults)
        service.isDNDAutomationEnabled = false
        service.isGrayscaleAutomationEnabled = false

        // This should not throw or crash when both automations are disabled
        service.notifySessionComplete(elapsedMinutes: 25)
    }

    @MainActor func test_restoredState_fromUserDefaults() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        defaults.set(true, forKey: "dndAutomationEnabled")
        defaults.set(false, forKey: "grayscaleAutomationEnabled")

        let service = AutomationService(userDefaults: defaults)

        XCTAssertTrue(service.isDNDAutomationEnabled)
        XCTAssertFalse(service.isGrayscaleAutomationEnabled)
    }
}
