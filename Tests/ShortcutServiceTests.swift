import XCTest
@testable import MonoFocus

final class ShortcutServiceTests: XCTestCase {
    func test_markPendingOff_setsFlagsWhenEnabled() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let service = ShortcutService(userDefaults: defaults)
        service.isDNDAutomationEnabled = true
        service.isGrayscaleAutomationEnabled = false

        service.markPendingOffIfEnabled()

        XCTAssertTrue(defaults.bool(forKey: "pendingDisableDND"))
        XCTAssertFalse(defaults.bool(forKey: "pendingDisableGrayscale"))
    }

    func test_savePersistsNames() {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let service = ShortcutService(userDefaults: defaults)
        service.dndShortcutName = "A"
        service.grayscaleShortcutName = "B"
        service.dndOffShortcutName = "C"
        service.grayscaleOffShortcutName = "D"
        service.save()

        XCTAssertEqual(defaults.string(forKey: "dndShortcutName"), "A")
        XCTAssertEqual(defaults.string(forKey: "grayscaleShortcutName"), "B")
        XCTAssertEqual(defaults.string(forKey: "dndOffShortcutName"), "C")
        XCTAssertEqual(defaults.string(forKey: "grayscaleOffShortcutName"), "D")
    }
}
