# MONO-013: Widget URL Safety Improvements

**Type:** Code Quality  
**Priority:** 🟢 Medium  
**Status:** Ready for Development  
**Estimate:** 1 hour  
**Phase:** 3 (Polish & Documentation)

---

## 📝 Description

Eliminate force unwraps in widget URL construction by creating a type-safe URL builder, aligning with project convention of avoiding `!` operator.

**Current:** Force unwraps static URLs (safe but violates convention)  
**Target:** Compile-time safe URL construction without `!`

---

## 🎯 Acceptance Criteria

- [ ] No force unwraps in MonoFocusWidgets.swift
- [ ] URLs constructed type-safely
- [ ] Widget functionality unchanged
- [ ] Code review confirms safety
- [ ] All widget taps work correctly

---

## 🔧 Refactoring Plan

### **Current Code (Force Unwraps)**

```swift
// mobile/MonoFocusWidgets/MonoFocusWidgets.swift
Link("25", destination: URL(string: "monofocus://start?minutes=25")!)
Link("45", destination: URL(string: "monofocus://start?minutes=45")!)
Link("90", destination: URL(string: "monofocus://start?minutes=90")!)
```

**Issue:** Uses force unwrap `!` (safe here but violates project standards)

---

### **Refactored Code (Type-Safe)**

```swift
// mobile/MonoFocusWidgets/MonoFocusWidgets.swift

// MARK: - URL Builder Extension

private extension URL {
    /// Creates a MonoFocus deep link URL to start a timer.
    ///
    /// - Parameter minutes: Duration in minutes (must be positive)
    /// - Returns: A valid `monofocus://start?minutes=N` URL
    ///
    /// This method uses `URLComponents` to guarantee valid URL construction
    /// without force unwrapping. If URL construction fails (which should never
    /// happen with valid inputs), it returns a fallback URL.
    static func monoFocusStart(minutes: Int) -> URL {
        var components = URLComponents()
        components.scheme = "monofocus"
        components.host = "start"
        components.queryItems = [
            URLQueryItem(name: "minutes", value: "\(minutes)")
        ]
        
        // Fallback to default 25 minutes if construction somehow fails
        return components.url ?? URL(string: "monofocus://start?minutes=25")!
    }
    
    /// Creates a MonoFocus deep link URL to stop the timer.
    static var monoFocusStop: URL {
        var components = URLComponents()
        components.scheme = "monofocus"
        components.host = "stop"
        return components.url ?? URL(string: "monofocus://stop")!
    }
}

// MARK: - Widget View

struct WidgetView: View {
    var entry: Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryRectangular:
            // Lock Screen: Horizontal layout
            HStack {
                Link("25", destination: .monoFocusStart(minutes: 25))
                Spacer()
                Link("45", destination: .monoFocusStart(minutes: 45))
                Spacer()
                Link("90", destination: .monoFocusStart(minutes: 90))
            }
            .font(.headline.monospacedDigit())
            .padding(.horizontal, 8)

        case .systemSmall:
            // Home Screen: Vertical layout
            VStack(spacing: 12) {
                Text("MonoFocus")
                    .font(.caption.weight(.semibold))
                    .foregroundColor(.secondary)
                
                VStack(spacing: 8) {
                    Link("25 min", destination: .monoFocusStart(minutes: 25))
                        .font(.body.weight(.medium))
                    Link("45 min", destination: .monoFocusStart(minutes: 45))
                        .font(.body.weight(.medium))
                    Link("90 min", destination: .monoFocusStart(minutes: 90))
                        .font(.body.weight(.medium))
                }
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.primary.opacity(0.05))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.primary.opacity(0.1), lineWidth: 1)
            )

        default:
            Text("Unsupported")
        }
    }
}
```

---

### **Alternative: Pure URLComponents (No Fallback Force Unwrap)**

If you want **zero** force unwraps, even in fallback:

```swift
private extension URL {
    static func monoFocusStart(minutes: Int) -> URL? {
        var components = URLComponents()
        components.scheme = "monofocus"
        components.host = "start"
        components.queryItems = [
            URLQueryItem(name: "minutes", value: "\(minutes)")
        ]
        return components.url
    }
}

// Usage:
if let url = URL.monoFocusStart(minutes: 25) {
    Link("25", destination: url)
} else {
    Text("25")  // Fallback if URL construction fails
}
```

**Trade-off:** More verbose, but 100% safe.

---

## 📋 Subtasks

- [ ] Create `URL` extension in MonoFocusWidgets.swift
- [ ] Replace all force unwraps with type-safe constructors
- [ ] Build widget target (no compiler errors)
- [ ] Test widgets on device:
  - Lock Screen widget taps work
  - Home Screen widget taps work
  - All 3 presets work correctly
- [ ] Code review for safety
- [ ] Update MONO-010 if URL constants needed

---

## 🧪 Testing

### **Manual Test**
1. Build and install app
2. Add Lock Screen widget
3. Tap each preset (25, 45, 90)
4. Verify app opens and timer starts with correct duration
5. Add Home Screen widget
6. Tap each preset
7. Verify same behavior

### **Xcode Preview Test**
```swift
#Preview("Lock Screen") {
    WidgetView(entry: Entry(date: Date()))
        .previewContext(WidgetPreviewContext(family: .accessoryRectangular))
}

#Preview("Home Screen") {
    WidgetView(entry: Entry(date: Date()))
        .previewContext(WidgetPreviewContext(family: .systemSmall))
}
```

---

## 🔗 Related

- **Code Review:** Issue #6 (Medium Priority)
- **Files Changed:**
  - `mobile/MonoFocusWidgets/MonoFocusWidgets.swift`
- **Related:** MONO-010 (may share URL constants)

---

## ⚠️ Risks

- **Very Low Risk:** Mechanical refactoring, URLs are static
- **Testing:** Requires device testing (widgets don't work in simulator taps)

---

**Created:** November 5, 2025  
**Assignee:** _Unassigned_  
**Reviewer:** Tech Lead
