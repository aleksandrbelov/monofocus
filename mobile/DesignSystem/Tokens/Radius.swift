import SwiftUI

/// Corner radius scale aligned with iOS standards.
enum Radius {
    enum Level: CGFloat, CaseIterable, Identifiable {
        case xs = 8
        case sm = 12
        case md = 16
        case lg = 20
        case xl = 24
        case xxl = 28
        case full = 9999

        var id: CGFloat { rawValue }

        var label: String {
            switch self {
            case .xs:
                return "XS"
            case .sm:
                return "SM"
            case .md:
                return "MD"
            case .lg:
                return "LG"
            case .xl:
                return "XL"
            case .xxl:
                return "XXL"
            case .full:
                return "Full"
            }
        }
    }

    static func value(_ level: Level) -> CGFloat {
        level.rawValue
    }
}

#if DEBUG
private struct RadiusPreviewRow: View {
    let level: Radius.Level

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("\(level.label) – \(level == .full ? "Full" : "\(Int(level.rawValue))pt")")
                .font(.caption)
                .foregroundStyle(Color.secondary)
            RoundedRectangle(cornerRadius: level == .full ? 24 : level.rawValue, style: .continuous)
                .fill(Color.surface(.surface2))
                .frame(height: 32)
        }
        .padding(.vertical, 4)
    }
}

struct RadiusPreview: PreviewProvider {
    static var previews: some View {
        VStack(alignment: .leading, spacing: 12) {
            ForEach(Radius.Level.allCases) { level in
                RadiusPreviewRow(level: level)
            }
        }
        .padding()
        .previewLayout(.sizeThatFits)
        .previewDisplayName("Radius Scale")
    }
}
#endif

