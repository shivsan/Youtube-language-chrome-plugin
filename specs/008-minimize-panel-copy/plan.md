# Implementation Plan: Minimize Panel Copy

## Technical Context

- **Stack**: Manifest V3 extension using plain HTML, CSS, and JavaScript.
- **Primary files**: `sidepanel.html`, `sidepanel.css`, `sidepanel.js`.
- **Tests**: Node source-contract tests plus full `npm test` validator and Chrome Canary verification.
- **Data/storage**: No schema or retention change.
- **Network/security**: No permission, origin, or request change.

## Constitution Check

- User behavior is specified before source changes.
- Translation remains the primary and more visually prominent experience.
- Accessible names replace any semantics lost with visible headings.
- The change remains local-only, dependency-free, and least privilege.
- TDD, validator, and Canary evidence are required.

## Design

1. Promote the existing visible brand label to the single document heading and remove the tagline.
2. Remove the current-card heading row, keep the region's accessible name, and place playback time within the content without an extra text row.
3. Render `-` for an empty advanced-word result.
4. Suppress only successful restore feedback; retain failures and collapse the empty status region.
5. Update source contracts before implementation, then run full validation and Canary checks.

## Files

```text
sidepanel.html
sidepanel.css
sidepanel.js
tests/sidepanel-layout.test.cjs
tests/known-word-tabs.test.cjs
specs/008-minimize-panel-copy/
```

## Post-Design Constitution Check

No exceptions. The design reduces secondary copy, preserves accessibility and stable geometry, and changes no privacy or security boundary.
