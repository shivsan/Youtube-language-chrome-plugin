# Tasks: Minimize Panel Copy

## Phase 1: UI Contracts

- [x] T001 [P] [US1] Add compact header and current-card copy contracts in `tests/sidepanel-layout.test.cjs`
- [x] T002 [P] [US2] Add collapsed feedback and no-success-message contracts in `tests/known-word-tabs.test.cjs`

## Phase 2: User Story 1 - Focus on translation content

- [x] T003 [US1] Remove the tagline and promote the brand label to the accessible document heading in `sidepanel.html`
- [x] T004 [US1] Remove visible current-card headings while preserving the labelled region and playback time in `sidepanel.html` and `sidepanel.css`
- [x] T005 [US1] Replace the verbose no-advanced-word sentence with `-` in `sidepanel.js`

## Phase 3: User Story 2 - Remove unnecessary success announcements

- [x] T006 [US2] Suppress successful known-word restore copy while retaining failures in `sidepanel.js`
- [x] T007 [US2] Collapse the empty vocabulary feedback region in `sidepanel.css`

## Phase 4: Evidence and Convergence

- [x] T008 Run focused tests, `npm test`, syntax checks, validator, and `git diff --check`
- [x] T009 Execute `quickstart.md` in Chrome Canary and record evidence in `verification.md`
- [x] T010 Reconcile the specification, plan, tasks, implementation, and evidence

## Dependencies

- T001–T002 precede source changes.
- T003–T005 complete US1 independently.
- T006–T007 complete US2 independently.
- T008–T010 follow implementation.

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001–FR-004, FR-007 | T001, T003–T005, T008–T009 |
| FR-005–FR-006 | T002, T006–T009 |
| FR-008 | T008–T010 |
