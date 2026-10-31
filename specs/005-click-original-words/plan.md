# Implementation Plan: Click Original Words to Learn

**Branch**: `main` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

## Summary

Tokenize the current German Original caption into safe text and inline word buttons. Reuse the bundled German lexicon and existing local vocabulary queue to add recognized or unlisted words, block known words, reflect saved state, and provide stable accessible feedback.

## Technical Context

**Language/Version**: Plain JavaScript supported by Manifest V3 Chrome 138+
**Primary Dependencies**: Existing browser APIs and bundled CEFR data; no new dependency
**Storage**: Existing `chrome.storage.local` `savedVocabulary` and `knownVocabulary`
**Testing**: Node built-in test runner, source contracts, manifest/security validator, Chrome Canary
**Target Platform**: Desktop Chrome/Canary side panel on YouTube watch and Shorts pages
**Performance Goal**: Tokenize captions of at most 1,000 characters synchronously without perceptible delay
**Constraints**: Local-only, textContent/DOM-node rendering, no new permissions/origins/network, bounded stable panel geometry
**Scale/Scope**: One current caption and at most 500 saved or known word keys

## Constitution Check

- **Specify User Behaviour First**: PASS — user stories, state outcomes, edge cases, and non-goals are explicit.
- **Local-First Privacy and Least Privilege**: PASS — only existing local word storage changes; no network or permission expansion.
- **Translation Is the Primary Experience**: PASS — interaction stays inside the compact Original reference and does not displace translation.
- **Evidence Before Completion**: PASS — TDD, validator, and Canary scenarios are planned.
- **Small, Reviewable Changes**: PASS — existing utility, side-panel, storage queue, and test boundaries are reused.

## Project Structure

```text
cefr-utils.js
sidepanel.html
sidepanel.css
sidepanel.js
tests/cefr-utils.test.cjs
tests/sidepanel-layout.test.cjs
tests/original-word-selection.test.cjs
specs/005-click-original-words/
```

## Design

1. Add a pure tokenizer that returns every lexical German token, resolving bundled dictionary metadata when available and using a normalized surface fallback otherwise.
2. Keep advanced-word detection as a filter over recognized tokens so automatic behavior is unchanged.
3. Permit saved entries with an unlisted level only for manually selected tokens; keep automatic collection restricted to valid CEFR entries.
4. Render Original words as inline buttons only for German, preserving punctuation with text nodes and using `textContent` throughout.
5. Serialize manual additions through the existing vocabulary write queue. Check known and saved state inside the queue to prevent races with automatic collection.
6. Update button state in place after vocabulary changes without restarting translation.
7. Reserve one compact status line below Original for polite feedback.

## Security, Privacy, and Migration

- No new permission, host, model, dependency, or fetch path.
- Caption text remains current-session only; selected vocabulary keeps the existing local retention contract.
- No HTML parsing or injection; every token and message is assigned through text nodes or `textContent`.
- Existing saved records remain valid. The sanitizer additionally accepts `null` as an honest unlisted level for new manual entries.

## Test Strategy

- Prove tokenizer, dictionary resolution, punctuation boundaries, unlisted fallback, below-threshold manual merge, and deduplication with pure tests.
- Prove the side panel exposes a stable live status and accessible inline word controls with source contracts.
- Run the full test suite, validator, and whitespace checks.
- Reload the unpacked extension in Canary; exercise add, repeat, known block, below-level, unlisted if available, keyboard, non-German fallback, and layout stability.

## Post-Design Constitution Check

All gates remain PASS. No exception is required.
