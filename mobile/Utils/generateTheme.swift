import Foundation

// Simple generator: reads design/figma-tokens.json and writes Utils/Theme.swift
// Run locally: `swift mobile/Utils/generateTheme.swift`
struct Tokens: Codable {
    struct Spacing: Codable { let xl: Double; let l: Double; let m: Double }
    let spacing: Spacing
}

let base = FileManager.default.currentDirectoryPath + "/MonoFocus"
let tokensURL = URL(fileURLWithPath: base).appendingPathComponent("design/figma-tokens.json")
let outURL = URL(fileURLWithPath: base).appendingPathComponent("mobile/Utils/Theme.swift")

let data = try Data(contentsOf: tokensURL)
let tokens = try JSONDecoder().decode(Tokens.self, from: data)

let content = """
import SwiftUI

struct Theme {
    static let spacingXL: CGFloat = \(tokens.spacing.xl)
    static let spacingL: CGFloat = \(tokens.spacing.l)
    static let spacingM: CGFloat = \(tokens.spacing.m)
    static let cornerRadius: CGFloat = 20

    static let monoPrimary = Color.primary
    static let monoSecondary = Color.secondary
}
"""

try content.write(to: outURL, atomically: true, encoding: .utf8)
print("Generated Theme.swift at \(outURL.path)")
