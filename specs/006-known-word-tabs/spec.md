# Feature Specification: Known Word Tabs

**Feature Branch**: `main`

**Created**: 2026-10-25

**Status**: Approved for implementation

**Input**: User description: "Make the reset section tabbed and let each known word be put back into Words to learn."

## User Scenarios & Testing

### User Story 1 - Browse learning and known words separately (Priority: P1)

As a German learner, I can switch between Words to learn and Known words without mixing the two states.

**Why this priority**: A visible known list replaces the opaque bulk reset and makes the vocabulary state understandable.

**Independent Test**: Open the vocabulary section with entries in both collections, switch tabs, and observe the correct list and count in each panel.

**Acceptance Scenarios**:

1. **Given** saved and known words exist, **When** the vocabulary section opens, **Then** Words to learn is selected and shows only saved words.
2. **Given** known words exist, **When** the learner selects Known, **Then** each known word is shown newest first with locally available metadata.
3. **Given** either collection is empty, **When** its tab is selected, **Then** a specific empty-state message is shown.

---

### User Story 2 - Move one known word back to learning (Priority: P1)

As a learner, I can choose a single known word and move it back to Words to learn without resetting all known words.

**Why this priority**: Learners often revise one judgment; bulk reset is too destructive and imprecise.

**Independent Test**: Select Learn again for one known word and observe that it disappears from Known, appears once in Words to learn, and all other entries are unchanged.

**Acceptance Scenarios**:

1. **Given** a known word, **When** Learn again is activated, **Then** the word is removed from Known and added once to Words to learn.
2. **Given** a known key found in the bundled German vocabulary, **When** it is restored, **Then** its bundled lemma, estimated CEFR level, meaning, and part of speech are used.
3. **Given** an unlisted known key, **When** it is restored, **Then** the key is restored without an invented level or meaning.
4. **Given** the learning list cannot retain the restored word because its limit is full, **When** Learn again is activated, **Then** the word remains Known and an error is announced.

---

### User Story 3 - Use the tabs and restore actions accessibly (Priority: P2)

As a keyboard or assistive-technology user, I can operate the vocabulary tabs and Learn again controls while the panel remains visually stable.

**Why this priority**: State recovery must be available without a pointer and should not make the reading interface jump.

**Independent Test**: Move between tabs with keyboard controls, activate Learn again, and hear feedback in a reserved status line.

**Acceptance Scenarios**:

1. **Given** focus is on a vocabulary tab, **When** Left, Right, Home, or End is pressed, **Then** focus and selection move according to the two-tab order.
2. **Given** a known word, **When** its restore action receives focus, **Then** its accessible name identifies the word and the destination.
3. **Given** a restore succeeds or fails, **When** feedback changes, **Then** it is announced politely without expanding the section.

### Edge Cases

- Stored known keys can outlive or be absent from the bundled vocabulary; they remain visible and restorable with honest unlisted metadata.
- A malformed, duplicate, empty, or overlong known key is still rejected by the existing sanitizer.
- Rapid repeated restore activation is serialized and cannot create duplicate saved entries.
- If corrupted local state contains the same key in both collections, initialization keeps the known choice authoritative.
- Restoring a word starts a new local learning record with one encounter and is not starred.
- Selecting another tab is a view preference for the current side-panel session only and is not persisted.
- The bulk Reset known action is removed; each known word must be restored explicitly.

## Requirements

### Functional Requirements

- **FR-001**: The vocabulary area MUST expose a two-tab interface named Words to learn and Known.
- **FR-002**: Words to learn MUST be the initially selected tab and only the selected tab panel MUST be visible.
- **FR-003**: Each tab MUST show the current count for its collection.
- **FR-004**: The Known panel MUST list every sanitized known key, newest first.
- **FR-005**: Known entries MUST use bundled German metadata when available and MUST label missing level or meaning as unlisted rather than inventing data.
- **FR-006**: Every known entry MUST provide an individual action labelled Learn again.
- **FR-007**: Learn again MUST add the selected word to saved vocabulary and remove the key from known vocabulary in one serialized local write.
- **FR-008**: Restoring MUST NOT create duplicate saved or known entries.
- **FR-009**: If the saved-vocabulary limit prevents retention, the selected key MUST stay known and the UI MUST announce the failure.
- **FR-010**: The bulk Reset known control and behavior MUST be removed.
- **FR-011**: The tabs MUST expose tab, tablist, and tabpanel semantics and support pointer, Tab, ArrowLeft, ArrowRight, Home, and End operation.
- **FR-012**: Restore feedback MUST use a polite live region with reserved height so content changes do not shift the layout.
- **FR-013**: Restoring a word MUST start it as unstarred with one encounter because earlier saved encounter history is not retained after a word is marked known.
- **FR-014**: The feature MUST introduce no new permission, origin, network request, dependency, or storage key.

### Key Entities

- **Vocabulary tab state**: The session-only selected view, either learning or known.
- **Known vocabulary entry**: An existing normalized local key plus optional metadata resolved from the bundled German lexicon.
- **Restored vocabulary entry**: A new saved record for the known key with one encounter, current timestamps, and no importance flag.
- **Vocabulary action feedback**: A concise success or failure message in the vocabulary section.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A learner can reach either vocabulary collection with one tab activation.
- **SC-002**: A learner can move one known word back to Words to learn with one Learn again activation.
- **SC-003**: After restore, exactly one collection contains the word and all unrelated words retain their state.
- **SC-004**: Tab selection and restore controls are fully operable by keyboard and expose accurate accessible state.
- **SC-005**: Success or failure feedback appears or is announced within one second and does not change the reserved section height.
- **SC-006**: Existing translation, original-word selection, automatic collection, star, known, clear, privacy, and local-storage behavior continue to pass regression checks.

## Assumptions

- "Learn again" is clearer than the generic "Save" because it describes both the prior state and the destination action.
- Existing `knownVocabulary` normalized string keys contain enough data to render and restore the list; bundled metadata is resolved at display time.
- The currently selected tab does not need to survive closing or reloading the side panel.
- After a successful restore, the Known tab stays selected so the learner can restore multiple words; the counts and feedback make the move visible.
