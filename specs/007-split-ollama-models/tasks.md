# Tasks: Split Ollama Models

**Input**: Design documents from `specs/007-split-ollama-models/`

**Tests**: TDD, validator, local Ollama smoke tests, and Chrome Canary evidence are required.

## Phase 1: Routing Contracts

- [x] T001 [P] Add exact 3B translation and 8B explanation request-model tests in `tests/ollama-client.test.cjs`
- [x] T002 [P] Add route-specific side-panel status-message source contracts in `tests/sidepanel-layout.test.cjs`

## Phase 2: User Story 1 - Faster quick translation (Priority: P1)

**Independent Test**: Translate a caption and observe an Ollama request naming `llama3.2:3b`, with existing Chrome fallback behavior retained.

- [x] T003 [US1] Export an explicit translation model constant and route quick translations through it in `ollama-client.js`
- [x] T004 [US1] Update translation setup and fallback messages to name the 3B model in `sidepanel.js`
- [x] T005 [US1] Preserve debounce, pause, timeout, loopback, output bounds, and Chrome Translator fallback in `ollama-client.js` and `sidepanel.js`

## Phase 3: User Story 2 - Richer explanations (Priority: P1)

**Independent Test**: Request an idiom explanation and observe an Ollama request naming `llama3.1:8b`, with existing Chrome LanguageModel fallback retained.

- [x] T006 [US2] Export an explicit explanation model constant and route explanations through it in `ollama-client.js`
- [x] T007 [US2] Update explanation progress and failure messages to name the 8B model in `sidepanel.js`
- [x] T008 [US2] Make shared missing-model errors identify the requested model in `ollama-client.js`

## Phase 4: Documentation and Evidence

- [x] T009 [P] Document the 3B/8B split and installation commands in `README.md`
- [x] T010 Run `npm test`, syntax checks, validator, and `git diff --check`, recording evidence in `specs/007-split-ollama-models/verification.md`
- [x] T011 Verify both models through local loopback Ollama and record measured results in `specs/007-split-ollama-models/verification.md`
- [x] T012 Reload the extension and execute `quickstart.md` in Chrome Canary
- [x] T013 Reconcile specification, plan, tasks, implementation, and evidence with convergence review

## Dependencies

- T001–T002 precede implementation.
- T003–T005 complete the quick-translation route.
- T006–T008 complete the independent explanation route.
- T009–T013 follow stabilized behavior.

## Parallel Execution

- T001 and T002 touch separate test files.
- T009 can proceed after route names are final while T010 prepares automated evidence.

## Requirement Traceability

| Requirements | Tasks |
|---|---|
| FR-001, FR-003–FR-005 | T001, T003–T005, T010–T012 |
| FR-002–FR-004, FR-006–FR-007 | T001–T002, T006–T008, T010–T012 |
| FR-008–FR-009 | T005, T008, T010–T013 |
| SC-001–SC-005 | T001–T013 |
