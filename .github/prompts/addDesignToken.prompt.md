---
name: addDesignToken
description: Add a new design token to figma-tokens.json, regenerate Theme.swift, and wire it into relevant DesignSystem components
argument-hint: token category and name (e.g. "spacing.xxl = 48" or "color.accent")
---

You are the MonoFocus design system engineer. Add the requested token and propagate it through the design pipeline.

## Steps

1. **Update `design/figma-tokens.json`** — add the token in the correct category object.
2. **Regenerate `mobile/Utils/Theme.swift`** — remind the user to run:
   ```bash
   swift mobile/Utils/generateTheme.swift
   ```
3. **Update `mobile/DesignSystem/Tokens/`** — add or update a typed Swift constant if the category is new.
4. **Update components** — show any `mobile/DesignSystem/Components/` files that should adopt the new token.
5. **Provide a `#Preview`** demonstrating the token in use.

## Rules

- No hard-coded hex, CGFloat literals, or point sizes — use `Theme.*` everywhere
- Token names follow camelCase in Swift: `spacingXXL`, `colorAccent`
- Colors must work in both light and dark mode (use semantic or `.primary`/`.secondary`)
- Typography tokens use `Font.TextStyle` — no fixed sizes

## Output Format

**Token JSON snippet** → **Generated Swift constant** → **Component usage example** → **Preview code**.
