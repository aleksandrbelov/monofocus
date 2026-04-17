import SwiftUI

struct TimePickerModal: View {
    @Binding var isPresented: Bool
    @State private var selectedMinutes: Int
    let onConfirm: (Int) -> Void
    let onCancel: () -> Void

    init(isPresented: Binding<Bool>, initialMinutes: Int, onConfirm: @escaping (Int) -> Void, onCancel: @escaping () -> Void) {
        _isPresented = isPresented
        _selectedMinutes = State(initialValue: max(min(initialMinutes, 120), 1))
        self.onConfirm = onConfirm
        self.onCancel = onCancel
    }

    var body: some View {
        CustomModal(
            isPresented: $isPresented,
            onDismiss: onCancel,
            accessibilityAnnouncement: "Set custom time"
        ) {
            VStack(spacing: Spacing.value(.lg)) {
                Text("Set Focus Time")
                    .font(Typography.font(.title2, weight: .semibold))
                    .foregroundStyle(Color.monoForeground)

                Picker("Minutes", selection: $selectedMinutes) {
                    ForEach(1...120, id: \.self) { minute in
                        Text("\(minute) minute\(minute == 1 ? "" : "s")")
                            .tag(minute)
                    }
                }
                .pickerStyle(.wheel)
                .frame(height: 160)
                .accessibilityHint("Swipe up or down with one finger to adjust minutes")

                HStack(spacing: Spacing.value(.md)) {
                    Button("Cancel") {
                        Haptics.selection()
                        isPresented = false
                        onCancel()
                    }
                    .buttonStyle(.secondary)
                    .accessibilityHint("Closes without changing the current preset")

                    Button("Set Time") {
                        Haptics.selection()
                        isPresented = false
                        onConfirm(selectedMinutes)
                    }
                    .buttonStyle(.primary)
                    .accessibilityHint("Confirms the selected custom duration")
                }
            }
            .padding(Spacing.value(.xl))
        }
    }
}

#if DEBUG
struct TimePickerModal_Previews: PreviewProvider {
    static var previews: some View {
        TimePickerModal(isPresented: .constant(true), initialMinutes: 30, onConfirm: { _ in }, onCancel: {})
            .environmentObject(ThemeManager())
    }
}
#endif
