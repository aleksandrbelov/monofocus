import Foundation

struct FocusSession: Codable, Identifiable {
    let id: UUID
    let start: Date
    let durationSeconds: Int
    let presetLabel: String?
    let completed: Bool
}
