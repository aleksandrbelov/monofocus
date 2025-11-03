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
        CustomModal(isPresented: $isPresented, onDismiss: onCancel) {
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

                HStack(spacing: Spacing.value(.md)) {
                    Button("Cancel") {
                        Haptics.selection()
                        isPresented = false
                        onCancel()
                    }
                    .buttonStyle(.secondary)

                    Button("Set Time") {
                        Haptics.selection()
                        isPresented = false
                        onConfirm(selectedMinutes)
                    }
                    .buttonStyle(.primary)
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

