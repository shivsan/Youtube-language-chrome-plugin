# Tasks: Translation Record Control

**Input**: Design documents from `/specs/001-translation-toggle/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-state-contract.md`

**Tests**: Automated state tests, extension validation, and the manual Canary scenario are required by the specification and constitution.

## Phase 1: Foundational State Boundary

**Purpose**: Establish a testable two-state contract before integrating the browser UI.

- [X] T001 [P] Add failing active/paused presentation and request-gating tests in `tests/translation-control.test.cjs`
- [X] T002 Implement the pure control presentation and automatic-request gate in `translation-control.js`
- [X] T003 Register `translation-control.js` in `sidepanel.html` and `scripts/validate.mjs`

**Checkpoint**: Pure behavior is covered and the extension validator recognizes the new local script.

---

## Phase 2: User Story 1 - Pause live translation (Priority: P1) 🎯 MVP

**Goal**: Let the learner stop automatic quick translations while captions and learning features continue.

**Independent Test**: With translation active, press the stop-square button and advance captions. The control becomes a red record symbol, quick translation remains paused, and original captions/history/vocabulary continue updating.

- [X] T004 [US1] Add the fixed-size semantic translation control to the header in `sidepanel.html`
- [X] T005 [P] [US1] Style active stop-square, paused red record, focus, and paused status states in `sidepanel.css`
- [X] T006 [US1] Load the session mode, render the control, and persist pause actions in `sidepanel.js`
- [X] T007 [US1] Gate all automatic translation entry points and invalidate scheduled/in-flight results when paused in `sidepanel.js`
- [X] T008 [US1] Keep caption rendering, history, vocabulary, language changes, and manual explanations working while paused in `sidepanel.js`

**Checkpoint**: User Story 1 works independently and no automatic translation begins or appears while paused.

---

## Phase 3: User Story 2 - Resume live translation (Priority: P2)

**Goal**: Let the learner restart automatic translation and immediately translate the selected caption.

**Independent Test**: With translation paused, press the red record control. The control becomes a stop square, the engine prepares, and the current and later captions translate.

- [X] T009 [US2] Implement race-safe resume behavior and current-caption translation in `sidepanel.js`

**Checkpoint**: Pause/resume state, labels, engine lifecycle, and output remain consistent through repeated presses.

---

## Phase 4: Polish and Evidence

**Purpose**: Document and verify the complete behavior.

- [X] T010 [P] Document the compact pause/resume control and session behavior in `README.md`
- [X] T011 Run `npm test` and record automated evidence against the specification
- [X] T012 Reload the unpacked extension and execute `quickstart.md` in Chrome Canary
- [X] T013 Reconcile specification, plan, tasks, implementation, and evidence with the convergence review

---

## Dependencies & Execution Order

- T001 precedes T002 so the pure behavior is test-first.
- T002 precedes T003 and all side-panel integration tasks.
- T004 and T005 may proceed independently after the state boundary exists.
- T006 precedes T007 and T008; T007 and T008 complete the pause story together.
- T009 depends on the completed pause state and lifecycle guards.
- T010 can run in parallel with implementation once the contract is stable.
- T011 and T012 require all implementation tasks; T013 requires all evidence.

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001–FR-004, FR-010–FR-011 | T001–T005 |
| FR-005 | T006–T007 |
| FR-006, FR-008 | T008 |
| FR-007 | T009 |
| FR-009 | T006, T009 |
| SC-001–SC-005 | T001, T004–T009, T012 |
| SC-006 | T003, T011, T013 |
