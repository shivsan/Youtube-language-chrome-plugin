# Implementation Plan: Translation-First Caption Layout

**Branch**: `002-translation-first-layout` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-translation-first-layout/spec.md`

## Summary

Reorder the current-caption card so the quick translation is first, visually dominant, and grouped with the explanation action. Retain the source caption below a divider as a smaller, muted, bounded reference with its existing CEFR word highlighting and vocabulary summary. Add a source-level layout contract test and manually verify the result in Chrome Canary.

## Technical Context

**Language/Version**: Plain JavaScript, HTML5, and CSS supported by Chrome 138+

**Primary Dependencies**: Existing Manifest V3 side panel; no new dependency

**Storage**: No changes; existing session and local storage remain untouched

**Testing**: Node.js built-in test runner, source/manifest validator, manual Chrome Canary scenario

**Target Platform**: Chrome and Chrome Canary side-panel extension on YouTube watch and Shorts pages

**Project Type**: Browser extension

**Performance Goals**: No new runtime work; caption updates preserve fixed card geometry

**Constraints**: Local-first behavior, no new permissions or network origins, text rendered safely, minimum 320-pixel panel width, keyboard-readable scroll regions

**Scale/Scope**: One existing current-caption card, one static layout contract test, and user documentation

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

- **Specify user behaviour first**: Pass. The specification defines visual order, hierarchy, overflow, status states, accessibility, and narrow-width behavior in observable terms.
- **Local-first privacy and least privilege**: Pass. The design changes only document order and styling; it adds no permission, origin, storage, model, or dependency.
- **Translation is the primary experience**: Pass. The translation becomes the first and strongest reading surface, while settings and duplicate source text remain subordinate.
- **Evidence before completion**: Pass. A static layout contract, the full automated suite, source validation, and a manual Canary scenario cover the change.
- **Small, reviewable changes**: Pass. The implementation is limited to HTML/CSS, one test, documentation, and feature records.

## Project Structure

### Documentation (this feature)

```text
specs/002-translation-first-layout/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── verification.md
├── contracts/
│   └── current-card-layout.md
├── checklists/
│   ├── requirements.md
│   └── ux.md
└── tasks.md
```

### Source Code (repository root)

```text
sidepanel.html                     # Translation-first document order and semantic grouping
sidepanel.css                      # Primary and secondary text hierarchy with bounded regions
tests/
└── sidepanel-layout.test.cjs      # Static layout and accessibility contract
README.md                          # User-visible translation-first behavior
```

**Structure Decision**: Preserve the existing flat Manifest V3 extension. The feature changes only the presentational hierarchy, so no JavaScript state or new component abstraction is warranted.

## Security, Privacy, and Migration Impact

- No manifest, permission, host, CSP, storage, or model request changes.
- Existing caption and model output continue to be inserted with `textContent`; reordering static elements does not create an HTML injection path.
- No migration is required because no retained state changes.
- The layout test reads bundled source only and adds no runtime code.

## Complexity Tracking

No constitution violations or justified complexity exceptions.
