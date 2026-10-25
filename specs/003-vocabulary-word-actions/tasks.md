# Tasks: Vocabulary Word Actions

**Input**: Design documents from `/specs/003-vocabulary-word-actions/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/word-actions.md`

**Tests**: Unit, source-contract, validator, and manual Canary evidence are required by the specification and constitution.

## Phase 1: Pure State Contracts

**Purpose**: Define deterministic important and known-word transformations before browser integration.

- [x] T001 [P] Add failing importance toggle, ordering, known filtering, and bounds tests in `tests/cefr-utils.test.cjs`
- [x] T002 Implement pure important-state and known-word helpers in `cefr-utils.js`

**Checkpoint**: Pure vocabulary transformations are race-independent and fully tested.

---

## Phase 2: User Story 1 - Mark an important word (Priority: P1) 🎯 MVP

**Goal**: Let learners toggle a persistent star and keep important words first.

**Independent Test**: Star and unstar a saved word, reload the panel, and confirm state, ordering, and encounter metadata.

- [x] T003 [P] [US1] Add failing accessible word-action source contracts in `tests/sidepanel-layout.test.cjs`
- [x] T004 [US1] Migrate, persist, and serialize important-state changes in `sidepanel.js`
- [x] T005 [US1] Render word-specific toggleable star controls in `sidepanel.js`
- [x] T006 [P] [US1] Style filled and empty star states, focus, and compact action layout in `sidepanel.css`

**Checkpoint**: Star state is accessible, ordered, persistent, and does not alter encounter data.

---

## Phase 3: User Story 2 - Mark a word as known (Priority: P1)

**Goal**: Remove known words and prevent future automatic collection.

**Independent Test**: Cross a saved word, encounter it later, and confirm it stays absent after panel reload.

- [x] T007 [US2] Load and sanitize bounded `knownVocabulary` data in `sidepanel.js`
- [x] T008 [US2] Replace one-time removal with queued known-word persistence and automatic-collection filtering in `sidepanel.js`
- [x] T009 [US2] Render accessible word-specific known controls in `sidepanel.js`
- [x] T010 [P] [US2] Style the known-word cross and destructive affordance in `sidepanel.css`

**Checkpoint**: Known status removes a word, persists locally, and prevents re-addition.

---

## Phase 4: User Story 3 - Recover known words (Priority: P2)

**Goal**: Provide a compact aggregate recovery path for accidental known-word choices.

**Independent Test**: Reset known words without changing saved entries, then encounter a reset word and confirm it can return.

- [x] T011 [US3] Add the conditional reset-known control to `sidepanel.html`
- [x] T012 [US3] Bind count, visibility, persistence, and reset behavior in `sidepanel.js`
- [x] T013 [P] [US3] Style reset-known within the compact learning-section actions in `sidepanel.css`

**Checkpoint**: Known suppression is recoverable without deleting active vocabulary.

---

## Phase 5: Documentation and Evidence

- [x] T014 [P] Document star, known-word suppression, reset, and local retention in `README.md`
- [x] T015 Run `npm test` and `git diff --check`, recording evidence in `specs/003-vocabulary-word-actions/verification.md`
- [ ] T016 Reload the unpacked extension and execute `quickstart.md` in Chrome Canary
- [ ] T017 Reconcile requirements, design, tasks, implementation, and evidence with the convergence review

## Dependencies & Execution Order

- T001 precedes T002; all UI/storage work depends on the pure contracts.
- T003 precedes T004–T006.
- T007–T010 depend on T002 and the existing queued vocabulary write boundary.
- T011–T013 depend on the known-word state from T007–T010.
- T014 may proceed after behavior stabilizes; T015–T016 require implementation completion; T017 requires all evidence.

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001–FR-005 | T001–T006, T015–T016 |
| FR-006–FR-008 | T001–T002, T007–T010, T015–T016 |
| FR-009–FR-010 | T011–T013, T015–T016 |
| FR-011–FR-014 | T001–T002, T004, T007, T015–T017 |
| SC-001–SC-005 | T001–T013, T015–T016 |
| SC-006 | T015–T017 |
