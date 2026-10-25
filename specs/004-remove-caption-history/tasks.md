# Tasks: Remove Caption History

**Input**: Design documents from `/specs/004-remove-caption-history/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/current-caption.md`

**Tests**: Regression, prompt, validator, and manual Canary evidence are required by the specification and constitution.

## Phase 1: Regression Contracts

**Purpose**: Define the absence of history before changing production code.

- [x] T001 [P] Add failing storage, UI, script, and prompt absence contracts in `tests/no-caption-history.test.cjs`
- [x] T002 [P] Update the current-only explanation expectation in `tests/ollama-client.test.cjs`
- [x] T003 [P] Remove obsolete history-merge expectations from `tests/subtitle-utils.test.cjs`

**Checkpoint**: Tests fail because active caption-history behavior still exists.

---

## Phase 2: User Story 1 - Focus on current caption (Priority: P1) 🎯 MVP

**Goal**: Remove all caption-history presentation and interaction.

**Independent Test**: Inspect the side panel after several captions and find no history surface or focusable history control.

- [x] T004 [P] [US1] Remove the caption-history section from `sidepanel.html`
- [x] T005 [P] [US1] Remove history-only selectors from `sidepanel.css`
- [x] T006 [US1] Remove history state, events, rendering, and previous-cue selection from `sidepanel.js`

**Checkpoint**: The side panel is focused on current translation and learning features.

---

## Phase 3: User Story 2 - Retain only current caption (Priority: P1)

**Goal**: Replace the session history collection with one latest cue and remove legacy data.

**Independent Test**: Submit multiple cues and observe only `latestCue`, with no `cueHistory` key.

- [x] T007 [US2] Replace history merging with latest-cue replacement and legacy cleanup in `background.js`
- [x] T008 [US2] Read and observe only the validated latest cue in `sidepanel.js`
- [x] T009 [P] [US2] Remove the unused history merge utility from `subtitle-utils.js`

**Checkpoint**: Caption retention is constant-space and migration removes the obsolete collection.

---

## Phase 4: User Story 3 - Explain current sentence independently (Priority: P2)

**Goal**: Keep explanations while eliminating previous-caption prompt context.

**Independent Test**: Inspect a local explanation request and find the current subtitle but no prior-context section.

- [x] T010 [P] [US3] Remove previous-caption context from the Ollama explanation prompt in `ollama-client.js`
- [x] T011 [US3] Remove previous-context collection and Prompt API input from `sidepanel.js`

**Checkpoint**: Both local explanation engines receive only the current sentence.

---

## Phase 5: Documentation and Evidence

- [x] T012 [P] Document current-caption-only retention and remove history claims in `README.md`
- [x] T013 Run `npm test` and `git diff --check`, recording evidence in `specs/004-remove-caption-history/verification.md`
- [x] T014 Reload the unpacked extension and execute `quickstart.md` in Chrome Canary
- [x] T015 Reconcile requirements, plan, tasks, implementation, and evidence with convergence review

## Dependencies & Execution Order

- T001–T003 precede implementation.
- T004–T006 deliver the visible P1 outcome.
- T007–T009 remove retained history and depend on the regression contract.
- T010–T011 remove hidden explanation context.
- T012 follows stabilized behavior; T013–T015 require implementation completion.

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001 | T001, T004–T006, T014 |
| FR-002–FR-005 | T001, T007–T009, T013–T014 |
| FR-006 | T001–T002, T010–T011, T013–T014 |
| FR-007–FR-008 | T001, T013–T015 |
| FR-009 | T012 |
| FR-010 | T001–T003, T013 |
| SC-001–SC-005 | T001–T015 |
