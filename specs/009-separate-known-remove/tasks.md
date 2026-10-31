# Tasks: Separate Known and Remove Actions

## Phase 1: UI Contracts

- [x] T001 [P] [US1] Add known-tick glyph, accessible-name, and success-affordance contracts
- [x] T002 [P] [US2] Add remove-cross behavior, accessible-name, and destructive-affordance contracts

## Phase 2: User Story 1 - Mark known with a tick

- [x] T003 [US1] Change the existing known-word control from a cross to a tick in `sidepanel.js`
- [x] T004 [US1] Give the known tick a success affordance in `sidepanel.css`

## Phase 3: User Story 2 - Remove with a cross

- [x] T005 [US2] Add a serialized remove-only vocabulary operation in `sidepanel.js`
- [x] T006 [US2] Render a separate word-specific remove cross in `sidepanel.js`
- [x] T007 [US2] Give the remove cross a destructive affordance in `sidepanel.css`

## Phase 4: Evidence and Convergence

- [x] T008 Run focused tests, `npm test`, syntax checks, validator, and `git diff --check`
- [x] T009 Execute `quickstart.md` in Chrome Canary and record evidence in `verification.md`
- [x] T010 Reconcile the specification, plan, tasks, implementation, and evidence

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001–FR-004, FR-006–FR-007 | T001, T003–T004, T006–T009 |
| FR-004–FR-005, FR-007 | T002, T005–T009 |
| FR-008 | T008–T010 |
