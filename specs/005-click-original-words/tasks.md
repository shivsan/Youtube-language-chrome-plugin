# Tasks: Click Original Words to Learn

**Input**: Design documents from `specs/005-click-original-words/`

**Tests**: TDD, validator, and manual Canary evidence are required by the specification and constitution.

## Phase 1: Regression Contracts

- [x] T001 [P] Add tokenizer, unlisted metadata, manual merge, and word-state tests in `tests/cefr-utils.test.cjs`
- [x] T002 [P] Add Original interaction, live status, accessibility, and stable-layout source contracts in `tests/original-word-selection.test.cjs`

## Phase 2: User Story 1 - Save a word directly (Priority: P1)

**Independent Test**: Select recognized, below-threshold, and unlisted German words and observe one honest saved entry for each.

- [x] T003 [US1] Implement all-word German tokenization and unlisted fallback in `cefr-utils.js`
- [x] T004 [US1] Extend saved-vocabulary merging and sanitization to accept manual unlisted words in `cefr-utils.js` and `sidepanel.js`
- [x] T005 [US1] Render German Original tokens as safe inline buttons and preserve text boundaries in `sidepanel.js`
- [x] T006 [US1] Serialize manual additions with automatic collection and local storage in `sidepanel.js`

## Phase 3: User Story 2 - Understand selection state (Priority: P1)

**Independent Test**: Save, repeat, and mark a word known while the current Original state and feedback remain accurate.

- [x] T007 [US2] Implement available, saved, and known classification plus non-mutating repeat behavior in `cefr-utils.js` and `sidepanel.js`
- [x] T008 [US2] Refresh current Original word states after vocabulary actions without re-running translation in `sidepanel.js`

## Phase 4: User Story 3 - Accessible stable interaction (Priority: P2)

**Independent Test**: Add a word with keyboard input, hear feedback, and observe bounded geometry; switch to a non-German source and see plain text.

- [x] T009 [P] [US3] Add the reserved polite word-action status region in `sidepanel.html`
- [x] T010 [US3] Add focus, hover, advanced, saved, known, and fixed-status styles in `sidepanel.css`
- [x] T011 [US3] Add accessible labels/states and non-German fallback behavior in `sidepanel.js`

## Phase 5: Documentation and Evidence

- [x] T012 [P] Document direct Original-word saving and unlisted metadata in `README.md`
- [x] T013 Run `npm test` and `git diff --check`, recording evidence in `specs/005-click-original-words/verification.md`
- [x] T014 Reload the unpacked extension and execute `quickstart.md` in Chrome Canary
- [x] T015 Reconcile specification, plan, tasks, implementation, and evidence with convergence review

## Dependencies

- T001–T002 precede implementation.
- T003–T006 deliver the primary add flow.
- T007–T008 depend on the add flow and complete state safety.
- T009–T011 complete the accessible UI contract.
- T012–T015 follow stabilized behavior.

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001–FR-002 | T001–T003, T005, T009–T011, T014 |
| FR-003–FR-005 | T001, T003–T006, T013–T014 |
| FR-006–FR-010 | T001–T002, T006–T011, T013–T014 |
| FR-011–FR-012 | T002, T011, T013–T015 |
| SC-001–SC-006 | T001–T015 |
