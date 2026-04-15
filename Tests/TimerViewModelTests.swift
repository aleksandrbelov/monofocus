import XCTest
@testable import MonoFocus

final class TimerViewModelTests: XCTestCase {
    private let asyncTeardownDelay: Duration = .milliseconds(100)

    func test_completionNotificationEmitted() async {
        let exp = expectation(description: "completion")
        let token = NotificationCenter.default.addObserver(forName: .timerSessionCompleted, object: nil, queue: .main) { _ in
            exp.fulfill()
        }
        defer { NotificationCenter.default.removeObserver(token) }

        let vm = await TimerViewModel()
        // Use test hook to emit completion without needing to wait.
        await vm._test_emitCompletionNotification()

        await fulfillment(of: [exp], timeout: 1.0)
    }

    func test_timerViewModelDeallocatesAfterStop() async {
        weak var weakViewModel: TimerViewModel?

        await MainActor.run {
            var viewModel: TimerViewModel? = TimerViewModel()
            // Exercise start/stop path when notification service is intentionally absent.
            viewModel?.start()
            viewModel?.stop()
            weakViewModel = viewModel
            viewModel = nil
        }

        // Give pending async teardown work a chance to complete before asserting deallocation.
        try? await Task.sleep(for: asyncTeardownDelay)
        XCTAssertNil(weakViewModel)
    }

    func test_timerViewModelDeallocatesAfterStopWithNotificationService() async {
        weak var weakViewModel: TimerViewModel?

        await MainActor.run {
            var viewModel: TimerViewModel? = TimerViewModel()
            let notificationService = NotificationService()
            viewModel?.start(notificationService: notificationService)
            viewModel?.stop()
            weakViewModel = viewModel
            viewModel = nil
        }

        // Give pending async teardown work a chance to complete before asserting deallocation.
        try? await Task.sleep(for: asyncTeardownDelay)
        XCTAssertNil(weakViewModel)
    }
}
