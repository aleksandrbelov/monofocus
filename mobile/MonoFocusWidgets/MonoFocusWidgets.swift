import WidgetKit
import SwiftUI

@main
struct MonoFocusWidgetsBundle: WidgetBundle {
    var body: some Widget {
        MonoFocusWidgets()
#if canImport(ActivityKit)
        if #available(iOSApplicationExtension 16.1, *) {
            TimerLiveActivityWidget()
        }
#endif
    }
}

struct MonoFocusWidgets: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "MonoFocusWidgets", provider: Provider()) { entry in
            WidgetView(entry: entry)
        }
        .configurationDisplayName("MonoFocus Presets")
        .description("Quick-start focus sessions")
        .supportedFamilies([.accessoryRectangular, .systemSmall])
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> Entry { Entry(date: Date()) }
    func getSnapshot(in context: Context, completion: @escaping (Entry) -> Void) { completion(Entry(date: Date())) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        completion(Timeline(entries: [Entry(date: Date())], policy: .never))
    }
}

struct Entry: TimelineEntry { let date: Date }

struct WidgetView: View {
    var entry: Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryRectangular:
            // Lock Screen: Horizontal layout
            HStack {
                Link("25", destination: URL(string: "monofocus://start?minutes=25")!)
                Spacer()
                Link("45", destination: URL(string: "monofocus://start?minutes=45")!)
                Spacer()
                Link("90", destination: URL(string: "monofocus://start?minutes=90")!)
            }
            .font(.headline.monospacedDigit())
            .padding(.horizontal, 12)

        case .systemSmall:
            // Home Screen: Vertical layout with labels
            VStack(spacing: 12) {
                Text("MonoFocus")
                    .font(.caption.weight(.semibold))
                    .foregroundColor(.secondary)

                VStack(spacing: 8) {
                    Link(destination: URL(string: "monofocus://start?minutes=25")!) {
                        PresetButton(minutes: 25)
                    }

                    Link(destination: URL(string: "monofocus://start?minutes=45")!) {
                        PresetButton(minutes: 45)
                    }

                    Link(destination: URL(string: "monofocus://start?minutes=90")!) {
                        PresetButton(minutes: 90)
                    }
                }
            }
            .padding(12)

        default:
            EmptyView()
        }
    }
}

struct PresetButton: View {
    let minutes: Int

    var body: some View {
        HStack {
            Text("\(minutes)m")
                .font(.title3.weight(.semibold).monospacedDigit())
            Spacer()
            Image(systemName: "timer")
                .font(.title3)
        }
        .foregroundColor(.primary)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.primary.opacity(0.1))
        )
    }
}
