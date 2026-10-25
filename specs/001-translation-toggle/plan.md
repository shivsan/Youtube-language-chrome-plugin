# Implementation Plan: Translation Record Control

**Branch**: `001-translation-toggle` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-translation-toggle/spec.md`

## Summary

Add a fixed-size record/stop button to the side-panel header. A session-scoped translation mode gates automatic translation requests, invalidates pending results when paused, and resumes by preparing the existing local-first engine and translating the selected caption. Caption capture, history, CEFR vocabulary, and manual explanations remain independent and continue working.

## Technical Context

**Language/Version**: Plain JavaScript supported by Chrome 138+, HTML5, CSS

**Primary Dependencies**: Chrome Manifest V3 APIs; existing Ollama loopback client; Chrome on-device Translator fallback

**Storage**: `chrome.storage.session` for `translationEnabled`; existing `chrome.storage.local` preferences and vocabulary are unchanged

**Testing**: Node.js built-in test runner, source/manifest validator, manual Chrome Canary scenario

**Target Platform**: Chrome/Chrome Canary side-panel extension on YouTube watch and Shorts pages

**Project Type**: Browser extension

**Performance Goals**: The visual state changes in the same UI event; no automatic translation request begins while paused

**Constraints**: Local-only model traffic, no new permissions or origins, no dynamic HTML, fixed control geometry, keyboard accessible

**Scale/Scope**: One side-panel view, one two-state session value, and the existing translation lifecycle

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

- **Specify user behaviour first**: Pass. The specification defines pause, resume, persistence, rapid input, and browser-session boundaries in observable terms.
- **Local-first privacy and least privilege**: Pass. The design adds no permission, origin, remote service, analytics, or caption retention. Only a Boolean mode is stored for the Chrome session.
- **Translation is the primary experience**: Pass. The compact header control exposes the translation state without expanding settings or moving the current-caption card.
- **Evidence before completion**: Pass. Pure state behavior receives automated tests; manifest/source validation and a manual Canary scenario cover browser UI behavior.
- **Small, reviewable changes**: Pass. The implementation uses one small pure utility plus focused edits to the existing side-panel files and documentation. No dependency is added.

## Project Structure

### Documentation (this feature)

```text
specs/001-translation-toggle/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── verification.md
├── contracts/
│   └── ui-state-contract.md
├── checklists/
│   ├── requirements.md
│   └── ux.md
└── tasks.md
```

### Source Code (repository root)

```text
sidepanel.html                 # Header control and script loading
sidepanel.css                  # Fixed-size record/stop presentation
sidepanel.js                   # Session state and translation lifecycle integration
translation-control.js        # Pure mode/view and request-gating helpers
tests/
└── translation-control.test.cjs
scripts/
└── validate.mjs              # Referenced-file and security validation
README.md                      # User-visible control documentation
```

**Structure Decision**: Preserve the existing flat Manifest V3 extension structure. A small UMD-style pure utility matches the established `cefr-utils.js` and `ollama-client.js` boundaries and can be tested without a DOM dependency.

## Security, Privacy, and Migration Impact

- No new Chrome permission, host permission, or content-script match is required.
- The only new retained value is `translationEnabled: boolean` in session storage; it disappears when the browser session ends.
- Caption and model output continue to be rendered through `textContent`.
- Pausing invalidates response sequencing so an in-flight local-model result cannot overwrite the paused message.
- Existing users require no migration. A missing session value means translation is active.

## Complexity Tracking

No constitution violations or justified complexity exceptions.
