# Implementation Plan: Known Word Tabs

**Branch**: `main` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

## Summary

Replace the bulk known-word reset with an accessible two-tab vocabulary section. Render known keys with local bundled metadata and provide a serialized Learn again action that safely moves one word back into the existing saved-vocabulary collection.

## Technical Context

**Language/Version**: Plain JavaScript supported by Manifest V3 Chrome 138+
**Primary Dependencies**: Existing browser APIs and bundled CEFR data; no new dependency
**Storage**: Existing `chrome.storage.local` `savedVocabulary` and `knownVocabulary`
**Testing**: Node built-in test runner, source contracts, manifest/security validator, Chrome Canary
**Target Platform**: Desktop Chrome/Canary side panel on YouTube watch and Shorts pages
**Performance Goal**: Render and switch at most 500 entries without perceptible delay
**Constraints**: Local-only, textContent/DOM-node rendering, no new permissions/origins/network, bounded status geometry
**Scale/Scope**: At most 500 saved records and 500 known normalized keys

## Constitution Check

- **Specify User Behaviour First**: PASS — tab, restore, error, and accessibility behavior are explicit.
- **Local-First Privacy and Least Privilege**: PASS — the existing local collections and bundled lexicon are reused.
- **Translation Is the Primary Experience**: PASS — vocabulary remains secondary and compact; dynamic feedback is bounded.
- **Evidence Before Completion**: PASS — utility tests, source contracts, validator, and Canary checks are planned.
- **Small, Reviewable Changes**: PASS — existing plain JS, DOM rendering, and serialized storage queue are reused.

## Project Structure

```text
cefr-utils.js
sidepanel.html
sidepanel.css
sidepanel.js
README.md
tests/cefr-utils.test.cjs
tests/known-word-tabs.test.cjs
specs/006-known-word-tabs/
```

## Design

1. Add pure helpers to remove one sanitized known key and resolve a known key against the existing lexicon with an honest unlisted fallback.
2. Replace the vocabulary header's count/reset controls with an ARIA tablist and two tabpanels. Keep the Clear action inside Words to learn.
3. Track the selected tab in side-panel memory only, defaulting to Words to learn on initialization.
4. Render known entries newest first from `knownVocabulary`; assign all user-facing text with `textContent`.
5. Serialize Learn again through the existing vocabulary write queue. Build the restored record with the existing merge utility, verify that it survived the collection limit, then persist both arrays together.
6. Keep the known key untouched on any retention or storage failure and announce a concise message in a fixed-height polite status region.
7. Add roving tab focus and Left/Right/Home/End keyboard behavior.

## Security, Privacy, and Migration

- No new permission, host, model, dependency, fetch path, or storage key.
- Known keys and restored records remain in local extension storage.
- User-controlled labels and bundled meanings are assigned through `textContent`, never HTML.
- Existing `knownVocabulary` values require no migration. Metadata is resolved on render, so legacy or unlisted keys remain recoverable.
- A successful restore intentionally creates a fresh, unstarred one-encounter saved record because the old record was discarded when marked known.

## Test Strategy

- Prove known-key removal, sanitization, recognized metadata resolution, and unlisted fallback with pure tests.
- Prove the tablist, panels, counts, Learn again contract, live status, keyboard behavior, and absence of bulk reset with source tests.
- Run the full test suite, extension validator, and whitespace checks.
- Reload the unpacked extension in Canary; inspect both tabs, keyboard operation, one restore, counts, focus, feedback, and layout stability.

## Post-Design Constitution Check

All gates remain PASS. No exception is required.
