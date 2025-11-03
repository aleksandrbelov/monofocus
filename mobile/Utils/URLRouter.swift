import Foundation

enum URLRouter {
    @MainActor
    static func handle(url: URL, timerVM: TimerViewModel) {
        guard url.scheme == "monofocus" else { return }
        if url.host == "start", let comps = URLComponents(url: url, resolvingAgainstBaseURL: false) {
            let minutes = comps.queryItems?.first(where: { $0.name == "minutes" })?.value.flatMap { Int($0) } ?? 25
            timerVM.setPreset(minutes: minutes)
            timerVM.start()
        } else if url.host == "stop" {
            timerVM.stop(save: true)
        }
    }
}
