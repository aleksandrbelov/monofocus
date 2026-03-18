---
name: addDesignToken
description: Add a new design token to figma-tokens.json, regenerate Theme.swift, and wire it into relevant Theme- and DesignSystem-level token APIs
argument-hint: token category and name (e.g. "spacing.xxl = 48" or "color.accent")
---

You are the MonoFocus design system engineer. Add the requested token and propagate it through the design pipeline.

## Steps

1. **Update `design/figma-tokens.json`** — add the token in the correct category object.
2. **If you introduce a new category (anything beyond `spacing`)**, also update `mobile/Utils/generateTheme.swift` so its Codable schema and generated output handle the new category and expose appropriate `Theme.*` constants.
3. **Regenerate `mobile/Utils/Theme.swift`** — remind the user to run:
   ```bash
   swift mobile/Utils/generateTheme.swift
   ```
4. **Update `mobile/DesignSystem/Tokens/`** — add or update a typed Swift constant if the category is new.
5. **Update components** — show any `mobile/DesignSystem/Components/` files that should adopt the new token.
6. **Provide a `#Preview`** demonstrating the token in use.

## Rules

- The current token pipeline only parses the `spacing` category by default. If the user requests a `color` or typography token (or any non-`spacing` category), you **must** also update `mobile/Utils/generateTheme.swift` (Codable schema + output) and then regenerate `Theme.swift` so the new tokens are available in code.
- No hard-coded hex, CGFloat literals, or point sizes — when working in legacy/non-DesignSystem views (e.g. `mobile/Views`, `mobile/Utils`), use generated `Theme.*` constants instead of literals.
- Within `mobile/DesignSystem/*`, consume DesignSystem token APIs (`Spacing`, `Radius`, `Typography`, `Color.surface/label/mono*`) rather than `Theme.*`, so new tokens integrate consistently with existing components.
- Token names follow camelCase in Swift: `spacingXXL`, `colorAccent`
- Colors must work in both light and dark mode (use semantic or `.primary`/`.secondary`)
- Typography tokens use `Font.TextStyle` — no fixed sizes

## Output Format

**Token JSON snippet** → **Generated Swift constant** → **Component usage example** → **Preview code**.
