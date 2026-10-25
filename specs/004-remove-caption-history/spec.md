# Feature Specification: Remove Caption History

**Feature Branch**: `004-remove-caption-history`

**Created**: 2026-10-25

**Status**: Approved for implementation

**Input**: User description: "Actually let's remove caption history"

## User Scenarios & Testing

### User Story 1 - Focus on the current caption (Priority: P1)

As a learner, I want the side panel to show only the current translation and learning tools so that previous captions do not compete for attention.

**Why this priority**: Translation is the primary experience, and the history section adds visual weight without helping the user's current learning flow.

**Independent Test**: Open the side panel while German captions are playing and confirm there is no caption-history heading, list, selection control, or history-clear action.

**Acceptance Scenarios**:

1. **Given** the side panel is open, **When** captions arrive, **Then** only the current caption experience updates and no history list appears.
2. **Given** several captions have played, **When** the learner reviews the full side panel, **Then** no previous caption is exposed for selection.

---

### User Story 2 - Retain only the current caption (Priority: P1)

As a privacy-conscious learner, I want the extension to retain only the current caption so that a session-scoped transcript is not accumulated behind the interface.

**Why this priority**: Removing the data model is necessary for the requested feature to be genuinely absent rather than merely hidden.

**Independent Test**: Deliver several valid caption cues and confirm the retained session state contains only the latest valid cue and no caption-history collection.

**Acceptance Scenarios**:

1. **Given** multiple captions arrive in sequence, **When** session storage is inspected, **Then** only the latest caption cue is retained.
2. **Given** an older extension session contains caption history, **When** the updated extension initializes, **Then** the obsolete history collection is removed.
3. **Given** a caption grows progressively, **When** each partial cue arrives, **Then** the current cue is replaced rather than accumulated.

---

### User Story 3 - Explain the current sentence independently (Priority: P2)

As a learner, I want idiom explanations to use the current sentence without silently retaining previous subtitles.

**Why this priority**: Explanation remains useful after history removal, but its context boundary must match the new privacy behavior.

**Independent Test**: Request an explanation and confirm the local model receives the current subtitle without a previous-caption context block.

**Acceptance Scenarios**:

1. **Given** a current subtitle exists, **When** the learner requests an explanation, **Then** the current subtitle is explained without previous-caption text.

### Edge Cases

- Invalid or empty latest-cue data is ignored and produces the existing empty current-caption state.
- Reloading the side panel restores only the latest valid current cue.
- Pausing translation continues to allow the current caption and vocabulary features to update; no history is created.
- Removal of an obsolete history key must not clear translation mode, language, level, or saved vocabulary data.

## Requirements

### Functional Requirements

- **FR-001**: The side panel MUST NOT display a caption-history section, history list, history selection controls, or history-clear action.
- **FR-002**: The extension MUST retain at most one valid caption cue in session storage.
- **FR-003**: A newly received valid cue MUST replace the previously retained cue.
- **FR-004**: The extension MUST remove the obsolete session-scoped caption-history collection during initialization.
- **FR-005**: The side panel MUST initialize and react to changes from the latest retained cue only.
- **FR-006**: Idiom and meaning explanations MUST NOT include previous-caption context.
- **FR-007**: Current translation, vocabulary collection, pause/resume, language settings, and learning-word actions MUST remain unchanged.
- **FR-008**: The change MUST NOT add permissions, origins, dependencies, analytics, cloud services, or persistent caption retention.
- **FR-009**: User-facing documentation MUST state that only the current caption is retained for the Chrome session.
- **FR-010**: Automated tests MUST reject reintroduction of caption-history storage, UI, and explanation context.

### Key Entities

- **Latest caption cue**: The single valid current subtitle cue retained for the active Chrome session, including its bounded identifier, text, title, playback time, and capture time.
- **Obsolete caption history**: The former session-scoped array of caption cues; it is removed and no longer written or read.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Zero caption-history UI elements are visible or keyboard-focusable in the side panel.
- **SC-002**: After any number of caption updates, session storage contains no caption-history array and at most one current cue.
- **SC-003**: Explanation requests contain zero previous-caption strings or context sections.
- **SC-004**: All existing automated checks plus new history-removal regression checks pass.
- **SC-005**: Chrome Canary shows the current translation, learning controls, and settings without a caption-history section at the supported minimum panel width.

## Assumptions

- “Remove caption history” means removing both the visible list and the stored session collection, not merely collapsing or hiding the section.
- Losing previous-caption context is an accepted privacy and focus tradeoff; the current sentence remains sufficient for explanations.
- The current cue remains session-scoped so the side panel can reopen without waiting for a new caption.
- Saved vocabulary and learner choices are not caption history and remain unchanged.
