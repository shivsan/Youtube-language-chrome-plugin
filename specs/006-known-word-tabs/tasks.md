# Tasks: Known Word Tabs

**Input**: Design documents from `specs/006-known-word-tabs/`

**Tests**: TDD, validator, and manual Canary evidence are required by the specification and constitution.

## Phase 1: Regression Contracts

- [x] T001 [P] Add known-key removal and recognized/unlisted resolution tests in `tests/cefr-utils.test.cjs`
- [x] T002 [P] Add tab semantics, panels, counts, Learn again, keyboard, status, and removed-reset source contracts in `tests/known-word-tabs.test.cjs`

## Phase 2: User Story 1 - Browse separate collections (Priority: P1)

**Independent Test**: Switch between populated and empty Words to learn and Known panels and observe accurate counts and entries.

- [x] T003 [US1] Replace the vocabulary header/reset layout with tablist and tabpanels in `sidepanel.html`
- [x] T004 [US1] Track selected tab, bind pointer and keyboard tab behavior, and render current counts/panels in `sidepanel.js`
- [x] T005 [US1] Resolve and render known entries newest first with honest local metadata in `cefr-utils.js` and `sidepanel.js`
- [x] T006 [US1] Style the tab strip, selected state, bounded lists, empty states, and responsive controls in `sidepanel.css`

## Phase 3: User Story 2 - Move one word back (Priority: P1)

**Independent Test**: Restore one recognized or unlisted known word and observe exactly one fresh saved entry while other words remain unchanged.

- [x] T007 [US2] Implement pure single-key removal and metadata resolution helpers in `cefr-utils.js`
- [x] T008 [US2] Implement serialized Learn again mutation, limit protection, and atomic local persistence in `sidepanel.js`
- [x] T009 [US2] Remove the bulk Reset known control, event, and function from side-panel files

## Phase 4: User Story 3 - Accessible stable interaction (Priority: P2)

**Independent Test**: Operate tabs and restore by keyboard and hear success/failure without layout movement.

- [x] T010 [US3] Add ARIA tab state, roving focus, descriptive restore labels, and polite feedback in `sidepanel.js`
- [x] T011 [US3] Reserve feedback height and add clear focus-visible styles in `sidepanel.css`

## Phase 5: Documentation and Evidence

- [x] T012 [P] Document vocabulary tabs and Learn again in `README.md`
- [x] T013 Run `npm test` and `git diff --check`, recording evidence in `specs/006-known-word-tabs/verification.md`
- [x] T014 Reload the unpacked extension and execute `quickstart.md` in Chrome Canary
- [x] T015 Reconcile specification, plan, tasks, implementation, and evidence with convergence review

## Dependencies

- T001-T002 precede implementation.
- T003-T006 deliver the tabbed browsing flow.
- T007-T009 complete individual restoration and depend on the rendered known list.
- T010-T011 complete the accessible UI contract.
- T012-T015 follow stabilized behavior.

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001-FR-005 | T001-T006, T013-T014 |
| FR-006-FR-010 | T001-T003, T005, T007-T009, T013-T014 |
| FR-011-FR-013 | T002-T004, T008, T010-T011, T013-T014 |
| FR-014 | T013-T015 |
| SC-001-SC-006 | T001-T015 |
