import SwiftUI

struct SetupView: View {
    @EnvironmentObject var automation: AutomationService
    @State private var testingStart = false
    @State private var testingEnd = false
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Automation Setup")) {
                    Text("MonoFocus can automatically enable Do Not Disturb and Grayscale modes when you start a focus session, then disable them when the session ends.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text("This requires creating two Shortcuts in the Shortcuts app.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.top, 4)
                }
                
                Section(header: Text("Step 1: Start Shortcut")) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("This shortcut runs when you start a focus session.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        TextField("Shortcut Name", text: $automation.startShortcutName)
                            .autocapitalization(.words)
                            .textContentType(.none)
                        
                        Button {
                            testingStart = true
                            automation.testShortcut(named: automation.startShortcutName) { success in
                                testingStart = false
                            }
                        } label: {
                            HStack {
                                if testingStart {
                                    ProgressView()
                                        .controlSize(.small)
                                }
                                Text(testingStart ? "Testing..." : "Test Start Shortcut")
                            }
                        }
                        .disabled(testingStart || automation.startShortcutName.isEmpty)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Actions to add:")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                            Text("• Set Focus → Do Not Disturb")
                                .font(.caption2)
                                .foregroundColor(.green)
                            Text("• Set Color Filters → Turn On → Grayscale")
                                .font(.caption2)
                                .foregroundColor(.green)
                        }
                        .padding(.top, 4)
                    }
                }
                
                Section(header: Text("Step 2: End Shortcut")) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("This shortcut runs when your focus session ends.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        TextField("Shortcut Name", text: $automation.endShortcutName)
                            .autocapitalization(.words)
                            .textContentType(.none)
                        
                        Button {
                            testingEnd = true
                            automation.testShortcut(named: automation.endShortcutName) { success in
                                testingEnd = false
                            }
                        } label: {
                            HStack {
                                if testingEnd {
                                    ProgressView()
                                        .controlSize(.small)
                                }
                                Text(testingEnd ? "Testing..." : "Test End Shortcut")
                            }
                        }
                        .disabled(testingEnd || automation.endShortcutName.isEmpty)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Actions to add:")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                            Text("• Turn Off Focus")
                                .font(.caption2)
                                .foregroundColor(.blue)
                            Text("• Set Color Filters → Turn Off")
                                .font(.caption2)
                                .foregroundColor(.blue)
                        }
                        .padding(.top, 4)
                    }
                }
                
                Section(header: Text("Detailed Instructions")) {
                    Button {
                        if let url = URL(string: "shortcuts://") {
                            UIApplication.shared.open(url)
                        }
                    } label: {
                        HStack {
                            Image(systemName: "arrow.up.forward.app")
                            Text("Open Shortcuts App")
                                .font(.headline)
                        }
                    }
                    
                    VStack(alignment: .leading, spacing: 12) {
                        instructionStep(number: 1, text: "Open the Shortcuts app")
                        instructionStep(number: 2, text: "Tap the + button to create a new shortcut")
                        instructionStep(number: 3, text: "Name it \"\(automation.startShortcutName)\"")
                        instructionStep(number: 4, text: "Add action: \"Set Focus\" → Choose \"Do Not Disturb\"")
                        instructionStep(number: 5, text: "Add action: \"Set Color Filters\" → Turn On → Grayscale")
                        instructionStep(number: 6, text: "Save the shortcut")
                        
                        Divider()
                            .padding(.vertical, 4)
                        
                        instructionStep(number: 7, text: "Create another shortcut named \"\(automation.endShortcutName)\"")
                        instructionStep(number: 8, text: "Add action: \"Turn Off Focus\"")
                        instructionStep(number: 9, text: "Add action: \"Set Color Filters\" → Turn Off")
                        instructionStep(number: 10, text: "Save the shortcut")
                        
                        Divider()
                            .padding(.vertical, 4)
                        
                        instructionStep(number: 11, text: "Return here and tap the Test buttons to verify")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
                
                Section(header: Text("Enable Automation")) {
                    Toggle("Enable Focus Automations", isOn: $automation.isAutomationEnabled)
                    
                    Text("When enabled, your shortcuts will run automatically when sessions start and end. Customize them in the Shortcuts app to include DND, Grayscale, or both.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Setup Automations")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private func instructionStep(number: Int, text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Text("\(number).")
                .fontWeight(.semibold)
                .frame(width: 24, alignment: .trailing)
            Text(text)
        }
    }
}

#Preview {
    SetupView()
        .environmentObject(AutomationService())
}
