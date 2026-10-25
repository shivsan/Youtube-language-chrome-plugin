# Implementation Plan: Vocabulary Word Actions

**Branch**: `003-vocabulary-word-actions` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-vocabulary-word-actions/spec.md`

## Summary

Extend locally saved vocabulary with a Boolean important flag and a bounded set of known-word keys. Add accessible star and known-word controls to each learning card, keep starred words first, suppress known words during automatic collection, and expose a compact reset-known recovery action. Preserve existing vocabulary data through sanitization and migration defaults.

## Technical Context

**Language/Version**: Plain JavaScript, HTML5, and CSS supported by Chrome 138+

**Primary Dependencies**: Existing Manifest V3 storage and CEFR utility; no new dependency

**Storage**: `chrome.storage.local` adds `important` on saved entries and a bounded `knownVocabulary` string array

**Testing**: Node.js built-in test runner, source/manifest validator, manual Chrome Canary scenario

**Target Platform**: Chrome and Chrome Canary side-panel extension

**Project Type**: Browser extension

**Performance Goals**: One bounded in-memory filter and sort over no more than 500 entries; one local storage write per action

**Constraints**: Local-only data, no new permissions or origins, validated/capped retained values, keyboard accessible controls, compact 320-pixel layout

**Scale/Scope**: Existing Words to learn list, at most 500 saved entries and 500 known keys

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

- **Specify user behaviour first**: Pass. Star, known, recovery, persistence, ordering, migration, and edge states are observable and specified.
- **Local-first privacy and least privilege**: Pass. Only bounded learning preferences are added to existing local extension storage; no permission or network change.
- **Translation is the primary experience**: Pass. Controls remain inside the secondary learning section and do not affect the translation card.
- **Evidence before completion**: Pass. Pure storage/state behavior receives unit tests; accessibility/layout receive source and Canary checks.
- **Small, reviewable changes**: Pass. Existing CEFR utility, vocabulary renderer, and styles are extended without dependency or architectural change.

## Project Structure

### Documentation (this feature)

```text
specs/003-vocabulary-word-actions/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── verification.md
├── contracts/
│   └── word-actions.md
├── checklists/
│   ├── requirements.md
│   └── ux.md
└── tasks.md
```

### Source Code (repository root)

```text
cefr-utils.js                  # Pure ordering, toggle, and known-word filtering helpers
sidepanel.html                 # Reset-known action
sidepanel.css                  # Compact word-action presentation and states
sidepanel.js                   # Storage migration, persistence, and event integration
tests/
├── cefr-utils.test.cjs        # Word state and ordering behavior
└── sidepanel-layout.test.cjs  # Accessible control/source contract
README.md                      # User-facing behavior and local retention
```

**Structure Decision**: Reuse the established pure CEFR utility for deterministic vocabulary transformations and keep Chrome storage/UI integration in the existing side panel.

## Security, Privacy, and Migration Impact

- Adds only `important: boolean` to each existing saved entry and `knownVocabulary: string[]` in local extension storage.
- Known keys are normalized vocabulary identifiers, not caption sentences, titles, or browsing data.
- Both collections remain capped at 500 entries and are sanitized on load.
- Older entries default to `important: false`; no destructive migration is required.
- All labels and learner data continue to use DOM text properties rather than HTML interpretation.
- No permission, origin, CSP, model, network, or dependency change.

## Complexity Tracking

No constitution violations or justified complexity exceptions.
