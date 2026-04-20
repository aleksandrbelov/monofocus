import XCTest
@testable import MonoFocus

final class SessionHistoryTests: XCTestCase {
    private func makeSessions() -> [FocusSession] {
        let now = Date()
        return [
            FocusSession(id: UUID(), start: now.addingTimeInterval(-3600), durationSeconds: 1500, presetLabel: "25m", completed: true),
            FocusSession(id: UUID(), start: now.addingTimeInterval(-7200), durationSeconds: 900, presetLabel: "15m", completed: false),
            FocusSession(id: UUID(), start: now.addingTimeInterval(-10800), durationSeconds: 2700, presetLabel: "45m", completed: true)
        ]
    }

    func test_filter_all_returnsAllSessions() {
        let sessions = makeSessions()
        XCTAssertEqual(sessions.count, 3)
    }

    func test_filter_completed_returnsOnlyCompleted() {
        let sessions = makeSessions()
        let completed = sessions.filter { $0.completed }
        XCTAssertEqual(completed.count, 2)
        XCTAssertTrue(completed.allSatisfy { $0.completed })
    }

    func test_filter_stopped_returnsOnlyStopped() {
        let sessions = makeSessions()
        let stopped = sessions.filter { !$0.completed }
        XCTAssertEqual(stopped.count, 1)
        XCTAssertFalse(stopped[0].completed)
    }

    func test_totalMinutes_calculatesCorrectly() {
        let sessions = makeSessions()
        let totalSeconds = sessions.reduce(0) { $0 + $1.durationSeconds }
        XCTAssertEqual(totalSeconds / 60, 85) // 25 + 15 + 45
    }

    func test_completedCount_calculatesCorrectly() {
        let sessions = makeSessions()
        let count = sessions.filter { $0.completed }.count
        XCTAssertEqual(count, 2)
    }

    func test_emptySessionsHaveZeroTotalMinutes() {
        let sessions: [FocusSession] = []
        let totalSeconds = sessions.reduce(0) { $0 + $1.durationSeconds }
        XCTAssertEqual(totalSeconds / 60, 0)
    }

    func test_reversedOrder_mostRecentFirst() {
        let sessions = makeSessions() // ordered oldest first
        let reversed = Array(sessions.reversed())
        XCTAssertTrue(reversed[0].start > reversed[1].start)
        XCTAssertTrue(reversed[1].start > reversed[2].start)
    }
}
