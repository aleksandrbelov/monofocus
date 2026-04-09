import XCTest
@testable import MonoFocus

/// Tests for `PersistenceActor` covering:
/// - Session accumulation (no lost updates under concurrent calls)
/// - State writes (atomic, no corruption under concurrent calls)
/// - Independent shared / legacy writes
/// - Fallback to legacy storage when shared URL is unavailable
final class PersistenceActorTests: XCTestCase {

    // MARK: - Temp directory lifecycle

    private var tempDir: URL!

    override func setUp() async throws {
        try await super.setUp()
        tempDir = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
        try FileManager.default.createDirectory(at: tempDir, withIntermediateDirectories: true)
    }

    override func tearDown() async throws {
        try? FileManager.default.removeItem(at: tempDir)
        try await super.tearDown()
    }

    // MARK: - Helpers

    /// Returns an actor whose shared URL is `nil` (simulating a missing App
    /// Group), writing only to the returned legacy URLs.
    private func makeActor(prefix: String = "") -> (PersistenceActor, sessionsURL: URL, stateURL: URL) {
        let base = prefix.isEmpty ? tempDir! : tempDir.appendingPathComponent(prefix)
        try? FileManager.default.createDirectory(at: base, withIntermediateDirectories: true)
        let sessionsURL = base.appendingPathComponent("sessions.json")
        let stateURL    = base.appendingPathComponent("timer-state.json")
        let actor = PersistenceActor(
            sharedSessionsURL: nil,
            legacySessionsURL: sessionsURL,
            sharedStateURL: nil,
            legacyStateURL: stateURL
        )
        return (actor, sessionsURL, stateURL)
    }

    private func makeSession(durationSeconds: Int = 1500) -> FocusSession {
        FocusSession(
            id: UUID(),
            start: Date(),
            durationSeconds: durationSeconds,
            presetLabel: "\(durationSeconds / 60)m",
            completed: true
        )
    }

    // MARK: - Session tests

    func test_appendSession_accumulatesSequentially() async throws {
        let (actor, sessionsURL, _) = makeActor()
        let s1 = makeSession(durationSeconds: 900)
        let s2 = makeSession(durationSeconds: 1500)

        await actor.appendSession(s1)
        await actor.appendSession(s2)

        let stored = try JSONDecoder().decode(
            [FocusSession].self, from: Data(contentsOf: sessionsURL))
        XCTAssertEqual(stored.count, 2)
        XCTAssertEqual(stored[0].id, s1.id)
        XCTAssertEqual(stored[1].id, s2.id)
    }

    func test_appendSession_noLostUpdates_underConcurrentCalls() async throws {
        let (actor, sessionsURL, _) = makeActor()
        let count = 20

        await withTaskGroup(of: Void.self) { group in
            for i in 0..<count {
                let session = makeSession(durationSeconds: (i + 1) * 60)
                group.addTask { await actor.appendSession(session) }
            }
        }

        let stored = try JSONDecoder().decode(
            [FocusSession].self, from: Data(contentsOf: sessionsURL))
        XCTAssertEqual(stored.count, count,
                       "All \(count) sessions must be persisted; no lost updates")
    }

    func test_appendSession_fallsBackToLegacy_whenSharedUnavailable() async throws {
        let (actor, sessionsURL, _) = makeActor()  // shared is nil
        let session = makeSession()

        await actor.appendSession(session)

        let stored = try JSONDecoder().decode(
            [FocusSession].self, from: Data(contentsOf: sessionsURL))
        XCTAssertEqual(stored.count, 1)
        XCTAssertEqual(stored[0].id, session.id)
    }

    func test_appendSession_writesToShared_whenProvided() async throws {
        let sharedSessions = tempDir.appendingPathComponent("shared-sessions.json")
        let legacySessions = tempDir.appendingPathComponent("legacy-sessions.json")
        let actor = PersistenceActor(
            sharedSessionsURL: sharedSessions,
            legacySessionsURL: legacySessions,
            sharedStateURL: nil,
            legacyStateURL: tempDir.appendingPathComponent("legacy-state.json")
        )
        let session = makeSession()
        await actor.appendSession(session)

        XCTAssertTrue(FileManager.default.fileExists(atPath: sharedSessions.path),
                      "Shared sessions file must be written when URL is provided")
        XCTAssertTrue(FileManager.default.fileExists(atPath: legacySessions.path),
                      "Legacy sessions file must also be written for redundancy")
    }

    // MARK: - State tests

    func test_writeState_producesValidJSON() async throws {
        let (actor, _, stateURL) = makeActor()
        let state: [String: Any] = [
            "total": 1500, "remaining": 900, "running": true, "paused": false
        ]
        let data = try JSONSerialization.data(withJSONObject: state, options: [])
        await actor.writeState(data)

        let stored = try JSONSerialization.jsonObject(with: Data(contentsOf: stateURL))
            as? [String: Any]
        XCTAssertNotNil(stored)
        XCTAssertEqual(stored?["total"] as? Int, 1500)
        XCTAssertEqual(stored?["remaining"] as? Int, 900)
    }

    func test_writeState_serialisesCalls_noCorruption() async throws {
        let (actor, _, stateURL) = makeActor()
        let states: [[String: Any]] = (0..<10).map { i in
            ["total": i * 60, "remaining": i * 30, "running": false, "paused": false]
        }

        await withTaskGroup(of: Void.self) { group in
            for state in states {
                if let data = try? JSONSerialization.data(withJSONObject: state, options: []) {
                    group.addTask { await actor.writeState(data) }
                }
            }
        }

        let fileData = try Data(contentsOf: stateURL)
        let json = try JSONSerialization.jsonObject(with: fileData) as? [String: Any]
        XCTAssertNotNil(json, "File must contain valid JSON after concurrent writes; no corruption")
    }

    func test_writeState_lastSequentialCallWins() async throws {
        let (actor, _, stateURL) = makeActor()

        for i in 0..<5 {
            let state: [String: Any] = [
                "total": i * 100, "remaining": i * 50, "running": false, "paused": false
            ]
            let data = try JSONSerialization.data(withJSONObject: state, options: [])
            await actor.writeState(data)
        }

        let json = try JSONSerialization.jsonObject(with: Data(contentsOf: stateURL))
            as? [String: Any]
        XCTAssertEqual(json?["total"] as? Int, 4 * 100,
                       "The last sequential write must be the value on disk")
    }

    func test_writeState_sharedAndLegacyAreIndependent() async throws {
        let sharedState = tempDir.appendingPathComponent("shared-state.json")
        let legacyState = tempDir.appendingPathComponent("legacy-state.json")
        let actor = PersistenceActor(
            sharedSessionsURL: nil,
            legacySessionsURL: tempDir.appendingPathComponent("sessions.json"),
            sharedStateURL: sharedState,
            legacyStateURL: legacyState
        )

        let state: [String: Any] = [
            "total": 1500, "remaining": 1500, "running": false, "paused": false
        ]
        let data = try JSONSerialization.data(withJSONObject: state, options: [])
        await actor.writeState(data)

        XCTAssertTrue(FileManager.default.fileExists(atPath: sharedState.path),
                      "Shared state must be written when URL is provided")
        XCTAssertTrue(FileManager.default.fileExists(atPath: legacyState.path),
                      "Legacy state must be written independently of the shared write")
    }
}
