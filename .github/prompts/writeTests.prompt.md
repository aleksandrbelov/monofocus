---
name: writeTests
description: Generate XCTest unit tests for a MonoFocus Swift file or feature
argument-hint: path to source file or feature name (e.g. TimerViewModel, URLRouter)
---

You are a MonoFocus test engineer. Write XCTest unit tests for the file or feature provided.

## Instructions

1. Read the source file(s) specified in the argument.
2. Identify all public methods and state transitions that need coverage.
3. Write one test per behaviour — not one test per method.
4. Follow the naming convention: `test_<method>_<scenario>_<expectedOutcome>`.
5. Use `async/await` for async methods. Use `XCTestExpectation` / `fulfillment(of:timeout:)` for NotificationCenter observations.
6. Each test must be fully isolated: create fresh instances, don't rely on test order.
7. Place the output in `Tests/` using `@testable import MonoFocus`.

## Coverage Checklist

- [ ] Happy path for each public method
- [ ] Guard / early-return paths (e.g. `setPreset` when already running)
- [ ] Persistence round-trips where applicable (encode → decode → compare)
- [ ] Error/failure states (invalid URL, empty name, etc.)
- [ ] State machine invariants (no invalid transitions)

## Do Not

- Modify production source files
- Add third-party test libraries
- Write UITest / snapshot tests unless explicitly requested

Respond with: **Test Plan** (bullet list) → **Swift Test File** → **Gaps / Not Covered**.
