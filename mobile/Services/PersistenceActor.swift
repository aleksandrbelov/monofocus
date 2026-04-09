import Foundation

/// Serialises all timer-state and session disk I/O so concurrent callers
/// never produce interleaved, out-of-order, or corrupted file writes.
///
/// Because this is a Swift actor every method call is enqueued on its
/// own serial executor — no manual locking or `OperationQueue` required.
/// All writes use `Data.write(to:options:.atomic)` which writes to a
/// temporary file first and then renames it, preventing partial writes.
actor PersistenceActor {

    // MARK: - Stored URLs

    private let sharedSessionsURL: URL?
    private let legacySessionsURL: URL
    private let sharedStateURL: URL?
    private let legacyStateURL: URL

    // MARK: - Init

    init(
        sharedSessionsURL: URL?,
        legacySessionsURL: URL,
        sharedStateURL: URL?,
        legacyStateURL: URL
    ) {
        self.sharedSessionsURL = sharedSessionsURL
        self.legacySessionsURL = legacySessionsURL
        self.sharedStateURL = sharedStateURL
        self.legacyStateURL = legacyStateURL
    }

    // MARK: - Session persistence

    /// Loads the existing session list, appends `session`, then writes the
    /// result atomically to both shared and legacy storage.  Because the
    /// entire read-modify-write cycle runs inside this actor method it is
    /// impossible for two concurrent callers to interleave and lose an update.
    func appendSession(_ session: FocusSession) {
        let existing: [FocusSession] = loadSessions(from: sharedSessionsURL)
            ?? loadSessions(from: legacySessionsURL)
            ?? []
        let updated = existing + [session]
        guard let data = try? JSONEncoder().encode(updated) else { return }
        writeIndependently(data, shared: sharedSessionsURL, legacy: legacySessionsURL)
    }

    // MARK: - State persistence

    /// Writes pre-encoded state `data` atomically to shared and legacy paths.
    /// Shared and legacy writes are independent: a failure in one does not
    /// prevent the other from succeeding.
    func writeState(_ data: Data) {
        writeIndependently(data, shared: sharedStateURL, legacy: legacyStateURL)
    }

    // MARK: - Private helpers

    private func loadSessions(from url: URL?) -> [FocusSession]? {
        guard let url, let data = try? Data(contentsOf: url) else { return nil }
        return try? JSONDecoder().decode([FocusSession].self, from: data)
    }

    /// Attempts the shared write and the legacy write independently so that a
    /// failure in the shared container does not prevent the legacy fallback
    /// from being updated.
    private func writeIndependently(_ data: Data, shared: URL?, legacy: URL) {
        if let shared {
            atomicWrite(data, to: shared, label: "shared")
        }
        atomicWrite(data, to: legacy, label: "legacy")
    }

    /// Writes `data` to `url` using the `.atomic` option, which writes to a
    /// temporary file and renames it — preventing readers from ever observing
    /// a partially-written file.
    private func atomicWrite(_ data: Data, to url: URL, label: String) {
        do {
            try data.write(to: url, options: .atomic)
        } catch {
#if DEBUG
            print("❌ PersistenceActor: \(label) write to \(url.lastPathComponent) failed: \(error)")
#endif
        }
    }
}
