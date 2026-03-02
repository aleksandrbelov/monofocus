import SwiftUI

struct SessionHistoryView: View {
    private let sessions: [FocusSession]
    private let reversedSessions: [FocusSession]

    init(sessions: [FocusSession]) {
        self.sessions = sessions
        self.reversedSessions = sessions.reversed()
    }

    @State private var filter: SessionFilter = .all
    @State private var showingExport = false
    @State private var exportURL: URL?
    @Environment(\.dismiss) private var dismiss

    enum SessionFilter: String, CaseIterable {
        case all = "All"
        case completed = "Completed"
        case stopped = "Stopped"
    }

    var filteredSessions: [FocusSession] {
        switch filter {
        case .all:
            return reversedSessions
        case .completed:
            return reversedSessions.filter { $0.completed }
        case .stopped:
            return reversedSessions.filter { !$0.completed }
        }
    }

    var totalMinutes: Int {
        sessions.reduce(0) { $0 + $1.durationSeconds } / 60
    }

    var completedCount: Int {
        sessions.filter { $0.completed }.count
    }

    var body: some View {
        NavigationView {
            Form {
                Section("Summary") {
                    HStack {
                        Label("\(sessions.count) total", systemImage: "timer")
                            .foregroundStyle(Color.monoForeground)
                        Spacer()
                        Text("\(totalMinutes) min total")
                            .font(Typography.font(.subheadline))
                            .foregroundStyle(Color.label(.secondary))
                    }
                    HStack {
                        Label("\(completedCount) completed", systemImage: "checkmark.circle.fill")
                            .foregroundStyle(.green)
                        Spacer()
                        Text("\(sessions.count - completedCount) stopped")
                            .font(Typography.font(.subheadline))
                            .foregroundStyle(Color.label(.secondary))
                    }
                }

                Section {
                    Picker("Filter", selection: $filter) {
                        ForEach(SessionFilter.allCases, id: \.self) { f in
                            Text(f.rawValue).tag(f)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                Section("Sessions") {
                    if filteredSessions.isEmpty {
                        Text("No sessions match this filter.")
                            .foregroundStyle(Color.label(.secondary))
                    } else {
                        ForEach(filteredSessions) { session in
                            SessionRowView(session: session)
                        }
                    }
                }

                if !sessions.isEmpty {
                    Section {
                        Button {
                            exportURL = SessionExporter.exportToCSV(sessions: sessions)
                            showingExport = exportURL != nil
                        } label: {
                            Label("Export CSV", systemImage: "square.and.arrow.up")
                        }
                    }
                }
            }
            .navigationTitle("Session History")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .sheet(isPresented: $showingExport) {
                if let url = exportURL {
                    ActivityViewController(activityItems: [url])
                }
            }
        }
    }
}

private struct SessionRowView: View {
    let session: FocusSession

    private var dateText: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: session.start)
    }

    private var durationText: String {
        let minutes = session.durationSeconds / 60
        let seconds = session.durationSeconds % 60
        return seconds == 0 ? "\(minutes) min" : "\(minutes)m \(seconds)s"
    }

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: Spacing.value(.xxs)) {
                Text(dateText)
                    .font(Typography.font(.body))
                    .foregroundStyle(Color.monoForeground)
                if let preset = session.presetLabel {
                    Text(preset)
                        .font(Typography.font(.caption1))
                        .foregroundStyle(Color.label(.secondary))
                }
            }
            Spacer()
            VStack(alignment: .trailing, spacing: Spacing.value(.xxs)) {
                Text(durationText)
                    .font(Typography.monospacedDigitFont(.subheadline, weight: .medium))
                    .foregroundStyle(Color.monoForeground)
                Image(systemName: session.completed ? "checkmark.circle.fill" : "xmark.circle")
                    .foregroundStyle(session.completed ? Color.green : Color.label(.secondary))
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(dateText), \(durationText), \(session.completed ? "completed" : "stopped")")
    }
}

#if DEBUG
struct SessionHistoryView_Previews: PreviewProvider {
    static var previews: some View {
        let now = Date()
        let sessions: [FocusSession] = [
            FocusSession(id: UUID(), start: now.addingTimeInterval(-3600), durationSeconds: 1500, presetLabel: "25m", completed: true),
            FocusSession(id: UUID(), start: now.addingTimeInterval(-7200), durationSeconds: 900, presetLabel: "15m", completed: false),
            FocusSession(id: UUID(), start: now.addingTimeInterval(-10800), durationSeconds: 2700, presetLabel: "45m", completed: true)
        ]
        return SessionHistoryView(sessions: sessions)
    }
}
#endif
