# Feature Specification: Translation Record Control

**Feature Branch**: `001-translation-toggle`

**Created**: 2026-10-25

**Status**: Ready

**Input**: User description: "Add a small record-style control that is red while translation is stopped and shows a stop square while translation is active. Pressing it stops or resumes translation."

## User Scenarios & Testing

### User Story 1 - Pause live translation (Priority: P1)

As a learner, I can stop live translation with one compact control when I want to focus on the original captions or reduce local model activity, while caption capture and learning features continue.

**Why this priority**: The learner needs direct control over work that otherwise runs automatically.

**Independent Test**: Start with translation active, press the stop-square control, advance to a new caption, and observe that no new translation is produced while the original caption, history, and vocabulary continue updating.

**Acceptance Scenarios**:

1. **Given** live translation is active, **When** the learner views the control, **Then** it shows a stop-square symbol and an accessible name that says it will stop live translation.
2. **Given** live translation is active, **When** the learner presses the control, **Then** translation becomes paused, pending translation results are ignored, and the current translation area clearly reports that translation is paused.
3. **Given** translation is paused, **When** new captions arrive, **Then** original captions, caption history, and vocabulary continue updating without new translation requests.

---

### User Story 2 - Resume live translation (Priority: P2)

As a learner, I can restart live translation from the same compact control and immediately translate the current caption.

**Why this priority**: Pausing is only useful when recovery is obvious and immediate.

**Independent Test**: Pause translation, press the red record control, and observe that the current caption is translated and later captions continue translating automatically.

**Acceptance Scenarios**:

1. **Given** translation is paused, **When** the learner views the control, **Then** it shows a red record symbol and an accessible name that says it will start live translation.
2. **Given** translation is paused, **When** the learner presses the control, **Then** translation resumes and the current caption is submitted for translation without another action.
3. **Given** translation was paused, **When** the side panel is closed and reopened during the same Chrome session, **Then** translation remains paused until the learner resumes it.

### Edge Cases

- Changing either language while paused must save the selection without restarting translation.
- Pressing stop while a translation is in flight must prevent its eventual result from replacing the paused message.
- An unavailable local model does not disable the toggle; the learner can pause or retry by stopping and starting.
- Repeated rapid presses must leave the control and translation engine in one consistent final state.
- Closing Chrome clears the paused state so a new browser session starts live translation automatically.

## Requirements

### Functional Requirements

- **FR-001**: The side panel MUST provide one compact translation control in the application header.
- **FR-002**: While live translation is active, the control MUST show a stop-square symbol.
- **FR-003**: While live translation is paused, the control MUST show a red record symbol.
- **FR-004**: The control MUST expose an accurate accessible name and tooltip for its next action in both states.
- **FR-005**: Pressing the active control MUST stop scheduling new translations and prevent pending results from changing the paused display.
- **FR-006**: While translation is paused, caption capture, history, vocabulary detection, and manual idiom explanations MUST remain available.
- **FR-007**: Pressing the paused control MUST restart translation and translate the currently selected caption.
- **FR-008**: Language changes made while paused MUST NOT restart translation.
- **FR-009**: The active or paused choice MUST persist while the same Chrome session remains open and MUST default to active in a new Chrome session.
- **FR-010**: The compact control MUST be keyboard operable, show a visible focus state, and communicate state without relying on colour alone.
- **FR-011**: The control MUST NOT cause the header or translation card to resize when its state changes.

### Key Entities

- **Translation mode**: A session-scoped state with `active` and `paused` values that determines whether automatic translation requests may run.
- **Control presentation**: The symbol, accessible name, tooltip, and visual state derived from the current translation mode.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A learner can pause or resume live translation with one press from either state.
- **SC-002**: Within one visual update after a press, the control symbol, accessible name, status label, and translation message all agree on the resulting state.
- **SC-003**: Zero new automatic translation requests begin while translation is paused.
- **SC-004**: In 100% of tested caption changes while paused, original captions and history continue updating.
- **SC-005**: The control occupies the same fixed dimensions in active and paused states and does not move the surrounding header content.
- **SC-006**: The complete automated test and extension validation suite passes after the feature is implemented.

## Assumptions

- “Translating” means the live automatic translation mode is enabled, not only the short period when a model request is in flight.
- Pausing translation does not pause YouTube playback or stop caption capture.
- Manual idiom explanations remain available because they are a separate learner action.
- The paused choice is session-scoped rather than a permanent preference.
