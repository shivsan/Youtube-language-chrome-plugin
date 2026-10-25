# Tasks: Translation-First Caption Layout

**Input**: Design documents from `/specs/002-translation-first-layout/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/current-card-layout.md`

**Tests**: A static layout contract, the full automated suite, source validation, and a manual Canary scenario are required by the specification and constitution.

## Phase 1: Layout Contract

**Purpose**: Protect the required reading order and hierarchy before changing the panel.

- [X] T001 [P] Add a failing source-level translation-first layout contract in `tests/sidepanel-layout.test.cjs`

**Checkpoint**: The contract fails against the original-first panel.

---

## Phase 2: User Story 1 - Read the translation first (Priority: P1) 🎯 MVP

**Goal**: Make quick translation the first and strongest reading surface while keeping its geometry stable.

**Independent Test**: With a current caption visible, the translation appears first, uses dominant typography, and long or status text remains within a fixed scrollable region.

- [X] T002 [US1] Reorder and semantically group the translation and explanation content in `sidepanel.html`
- [X] T003 [US1] Add prominent translation typography and fixed overflow behavior in `sidepanel.css`

**Checkpoint**: The translation-first contract passes and the primary region does not resize with content length.

---

## Phase 3: User Story 2 - Refer back to the original (Priority: P2)

**Goal**: Keep the original caption as a compact secondary reference with its learning cues intact.

**Independent Test**: The original appears below the translation group in smaller muted type, remains focusable and scrollable, and above-level vocabulary remains directly after it.

- [X] T004 [US2] Place the original reference and vocabulary summary below the translation group in `sidepanel.html`
- [X] T005 [US2] Add compact muted original-caption styling while preserving focus and bounded overflow in `sidepanel.css`

**Checkpoint**: Both reading regions preserve stable geometry and the original learning cues remain available.

---

## Phase 4: Documentation and Evidence

**Purpose**: Document, validate, and visually confirm the change.

- [X] T006 [P] Document the translation-first current card in `README.md`
- [X] T007 Run `npm test` and record automated evidence in `specs/002-translation-first-layout/verification.md`
- [X] T008 Reload the unpacked extension and execute `quickstart.md` in Chrome Canary
- [X] T009 Reconcile specification, plan, tasks, implementation, and evidence with the convergence review

## Dependencies & Execution Order

- T001 precedes T002–T005 so the behavior change is test-first.
- T002 and T004 are one ordered HTML edit; T003 and T005 are one ordered CSS edit.
- T006 may proceed once the hierarchy is stable.
- T007 and T008 require implementation completion; T009 requires all evidence.

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001–FR-006 | T001–T003, T008 |
| FR-007–FR-009 | T001, T004–T005, T008 |
| FR-010–FR-012 | T001, T007–T009 |
| SC-001–SC-004 | T001–T005, T008 |
| SC-005–SC-006 | T007–T009 |
