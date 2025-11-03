import SwiftUI
import UIKit

/// Base modal overlay applying MonoFocus styling and accessibility affordances.
struct CustomModal<Content: View>: View {
    @Binding var isPresented: Bool
    let onDismiss: (() -> Void)?
    @ViewBuilder var content: () -> Content

    @State private var animateIn = false
    @AccessibilityFocusState private var isAccessibilityFocused: Bool

    init(isPresented: Binding<Bool>, onDismiss: (() -> Void)? = nil, @ViewBuilder content: @escaping () -> Content) {
        _isPresented = isPresented
        self.onDismiss = onDismiss
        self.content = content
    }

    var body: some View {
        if isPresented {
            ZStack {
                backdrop
                modalContent
            }
            .onAppear {
                animateIn = false
                withAnimation(Animations.respectingReduceMotion(Animations.modal)) {
                    animateIn = true
                }
                announceForAccessibility()
            }
            .onDisappear {
                animateIn = false
                isAccessibilityFocused = false
            }
        }
    }

    private var backdrop: some View {
        Rectangle()
            .fill(.ultraThinMaterial)
            .overlay(Color.black.opacity(0.45))
            .ignoresSafeArea()
            .onTapGesture {
                dismiss()
            }
            .accessibilityHidden(true)
    }

    private var modalContent: some View {
        content()
            .frame(width: 320)
            .background(
                RoundedRectangle(cornerRadius: Radius.value(.xl), style: .continuous)
                    .fill(Color.monoBackground)
            )
            .monoShadow(Shadows.xl)
            .overlay(
                RoundedRectangle(cornerRadius: Radius.value(.xl), style: .continuous)
                    .stroke(Color.surface(.surface2).opacity(0.5))
            )
            .scaleEffect(animateIn ? 1 : 0.8)
            .opacity(animateIn ? 1 : 0)
            .animation(Animations.respectingReduceMotion(Animations.modal), value: animateIn)
            .accessibilityAddTraits(.isModal)
            .accessibilityFocused($isAccessibilityFocused)
            .transition(
                .asymmetric(
                    insertion: .scale(scale: 0.8).combined(with: .opacity),
                    removal: .opacity
                )
            )
    }

    private func dismiss() {
        withAnimation(Animations.respectingReduceMotion(Animations.modal)) {
            isPresented = false
            onDismiss?()
        }
    }

    private func announceForAccessibility() {
        guard UIAccessibility.isVoiceOverRunning else { return }
        DispatchQueue.main.async {
            self.isAccessibilityFocused = true
            UIAccessibility.post(notification: .screenChanged, argument: nil)
        }
    }
}
