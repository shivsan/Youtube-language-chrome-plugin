# Implementation Plan: Remove Caption History

**Branch**: `004-remove-caption-history` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-remove-caption-history/spec.md`

## Summary

Remove the visible caption-history experience and replace the background's bounded history array with a single session-scoped latest cue. Delete obsolete session history during initialization and remove previous-caption context from both local explanation engines. Preserve all translation and learning behavior.

## Technical Context

**Language/Version**: Plain JavaScript, HTML5, and CSS supported by Chrome 138+

**Primary Dependencies**: Existing Manifest V3 storage; no new dependency

**Storage**: `chrome.storage.session.latestCue` only for caption data; obsolete `cueHistory` removed

**Testing**: Node.js built-in test runner, source/manifest validator, manual Chrome Canary scenario

**Target Platform**: Chrome and Chrome Canary side-panel extension

**Project Type**: Browser extension

**Performance Goals**: Constant-space caption retention with one queued session write per accepted cue

**Constraints**: Local-only, current cue only, no new permission or origin, stable minimum-width side panel

**Scale/Scope**: One current cue of at most 1,000 text characters

## Constitution Check

*GATE: Passed before research and re-checked after design.*

- **Specify user behaviour first**: Pass. UI removal, storage retention, migration, prompt boundary, and unaffected features are observable and specified.
- **Local-first privacy and least privilege**: Pass. Caption retention is reduced from 60 cues to one; no permission or network expansion.
- **Translation is the primary experience**: Pass. A secondary section is removed while current translation and learning controls remain.
- **Evidence before completion**: Pass. Storage, source, prompt, manifest, and Canary checks are required.
- **Small, reviewable changes**: Pass. Existing service-worker, side-panel, prompt, utility, tests, and documentation boundaries are reduced without architectural additions.

The constitution's session-scoped-history wording is interpreted as an upper-bound rule for any retained caption collection. Removing that collection and retaining only the current cue strengthens Principles II and III rather than weakening them.

## Project Structure

### Documentation (this feature)

```text
specs/004-remove-caption-history/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── verification.md
├── contracts/
│   └── current-caption.md
├── checklists/
│   ├── requirements.md
│   └── retention.md
└── tasks.md
```

### Source Code (repository root)

```text
background.js                    # Retain only latestCue and remove obsolete cueHistory
subtitle-utils.js                # Remove the unused history merge utility
sidepanel.html                   # Remove history section
sidepanel.css                    # Remove history-only presentation
sidepanel.js                     # Read/react to latestCue; remove history and context logic
ollama-client.js                 # Explain only the current subtitle
README.md                        # Document current-cue-only retention
tests/
├── no-caption-history.test.cjs  # Storage/UI/prompt regression contract
├── ollama-client.test.cjs       # Current-caption-only prompt contract
└── subtitle-utils.test.cjs      # Remove obsolete history-merge tests
```

**Structure Decision**: Remove the obsolete feature within existing Manifest V3 boundaries; do not introduce replacement UI, toggles, or storage abstractions.

## Security, Privacy, and Migration Impact

- Caption retention decreases from up to 60 cues to one valid current cue.
- The obsolete `cueHistory` session key is deleted whenever the service worker initializes.
- Explanation prompts no longer include previous-caption strings.
- No local preference or vocabulary key is removed.
- No permission, host, CSP, dependency, model, or network change.

## Complexity Tracking

No constitution violation or complexity exception is required.
