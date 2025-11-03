import Foundation

struct SessionExporter {
    static func exportToCSV(sessions: [FocusSession]) -> URL? {
        guard !sessions.isEmpty else { return nil }

        let header = "Date,Time,Duration (min),Preset,Completed\n"

        let dateFormatter = DateFormatter()
        dateFormatter.dateStyle = .medium
        dateFormatter.timeStyle = .none

        let timeFormatter = DateFormatter()
        timeFormatter.dateStyle = .none
        timeFormatter.timeStyle = .short

        let rows = sessions.map { session -> String in
            let date = dateFormatter.string(from: session.start)
            let time = timeFormatter.string(from: session.start)
            let duration = session.durationSeconds / 60
            let preset = session.presetLabel ?? ""
            let completed = session.completed ? "Yes" : "No"

            let escapedDate = date.contains(",") ? "\"\(date)\"" : date
            let escapedPreset = preset.contains(",") ? "\"\(preset)\"" : preset

            return "\(escapedDate),\(time),\(duration),\(escapedPreset),\(completed)"
        }.joined(separator: "\n")

        let csv = header + rows

        let tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("focus-sessions-\(Date().timeIntervalSince1970).csv")

        do {
            try csv.write(to: tempURL, atomically: true, encoding: .utf8)
            return tempURL
        } catch {
            print("CSV export failed: \(error)")
            return nil
        }
    }
}
