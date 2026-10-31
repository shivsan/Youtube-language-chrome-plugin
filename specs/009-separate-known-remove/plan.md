# Implementation Plan: Separate Known and Remove Actions

## Technical Context

- **Stack**: Manifest V3 extension using plain HTML, CSS, and JavaScript.
- **Primary files**: `sidepanel.js` and `sidepanel.css`.
- **Tests**: Node source-contract tests, full `npm test` validator, and Chrome Canary verification.
- **Data/storage**: Reuse `savedVocabulary` and `knownVocabulary`; no schema change.
- **Network/security**: No permission, origin, request, or dependency change.

## Constitution Check

- User behavior is specified before source changes.
- Translation remains the primary experience.
- Each compact icon retains a word-specific accessible name and tooltip.
- The change remains local-only, dependency-free, and least privilege.
- TDD, validator, and Canary evidence are required.

## Design

1. Keep the existing serialized known-word operation, but present it as a tick.
2. Add a serialized remove-only operation that updates `savedVocabulary` and leaves `knownVocabulary` unchanged.
3. Render a separate remove cross after the known tick.
4. Give the tick a success affordance and the cross a destructive affordance.
5. Update source contracts before implementation, then run full validation and Canary checks.

## Files

```text
sidepanel.js
sidepanel.css
tests/known-word-tabs.test.cjs
tests/sidepanel-layout.test.cjs
specs/009-separate-known-remove/
```

## Post-Design Constitution Check

No exceptions. The design separates user intent while retaining local persistence, accessibility, and least privilege.
