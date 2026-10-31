# Feature Specification: Click Original Words to Learn

**Feature Branch**: `main`

**Created**: 2026-10-25

**Status**: Approved for implementation

**Input**: User description: "Click a word in the Original section to add it to Words to learn."

## User Scenarios & Testing

### User Story 1 - Save a word directly from the caption (Priority: P1)

As a German learner, I can select a word in the current original subtitle and add it to my learning list without searching for it elsewhere.

**Why this priority**: Direct selection turns the subtitle into the shortest path from noticing a word to saving it.

**Independent Test**: Display a German caption containing words both below and above the learner level, select either word, and observe one corresponding entry in Words to learn.

**Acceptance Scenarios**:

1. **Given** a German word in the Original section that exists in the bundled vocabulary, **When** the learner selects it, **Then** its normalized lemma, estimated level, and meaning are added to Words to learn.
2. **Given** a German word that is not in the bundled vocabulary, **When** the learner selects it, **Then** the visible word is added with an explicit unlisted-level label and no invented meaning.
3. **Given** a word below the selected learner level, **When** the learner selects it, **Then** it is saved because manual selection overrides automatic level filtering.

---

### User Story 2 - Understand the selection state (Priority: P1)

As a learner, I can tell whether a subtitle word is available, saved, or marked known, and repeated selection does not create duplicate entries.

**Why this priority**: Clear state prevents accidental duplication and preserves the meaning of the known-word choice.

**Independent Test**: Save a word, select it again, mark it known, and select it again; the list contains at most one entry and the Original section reports each state accurately.

**Acceptance Scenarios**:

1. **Given** a word already in Words to learn, **When** the learner selects it again, **Then** no duplicate or artificial encounter is added and feedback says it is already saved.
2. **Given** a word marked known, **When** the learner selects it, **Then** it remains excluded and feedback explains that it is marked known.
3. **Given** a vocabulary state change, **When** the Original section is still showing the same caption, **Then** the word's visible and accessible state updates without re-running translation.

---

### User Story 3 - Use word selection accessibly (Priority: P2)

As a keyboard or assistive-technology user, I can discover and activate original-caption words without losing the stable reading layout.

**Why this priority**: The interaction must not make the subtitle harder to read or exclude non-pointer users.

**Independent Test**: Navigate the Original sentence by keyboard, activate a word, and hear concise status feedback while the current card keeps the same bounded geometry.

**Acceptance Scenarios**:

1. **Given** a German caption, **When** focus moves through the Original section, **Then** every lexical word is a focusable control with an action or state label.
2. **Given** a word activation, **When** feedback changes, **Then** it is announced through a polite status region and occupies a reserved line that does not make the panel jump.
3. **Given** a non-German source language, **When** a caption is shown, **Then** the Original remains plain reference text and does not imply German vocabulary support.

### Edge Cases

- Punctuation and surrounding whitespace remain readable and are not interactive.
- Hyphenated words and words containing apostrophes are treated as one lexical token.
- Rapid repeated selections and automatic advanced-word collection cannot produce duplicates.
- A caption update replaces the controls and clears stale feedback.
- An unlisted word uses its displayed spelling as the saved label and a normalized lowercase key for deduplication.
- A word marked known stays excluded until the learner uses the existing Reset known action.
- The 500-entry vocabulary limit and important-word retention behavior remain in force.

## Requirements

### Functional Requirements

- **FR-001**: Every lexical word in a German Original caption MUST be individually selectable with pointer and keyboard input.
- **FR-002**: Non-word punctuation and whitespace MUST remain non-interactive and visually preserved.
- **FR-003**: Selecting a recognized word MUST save its normalized lemma, estimated CEFR level, meaning, and part of speech through the existing local vocabulary collection.
- **FR-004**: Selecting an unlisted word MUST save its displayed form with an unlisted level and without an invented definition.
- **FR-005**: Manual selection MUST allow words at any CEFR level and MUST NOT depend on the automatic above-level threshold.
- **FR-006**: A saved word MUST NOT be duplicated or have its encounter count increased solely because it is selected again in the same visible caption.
- **FR-007**: A word in the known-word collection MUST remain excluded when selected and MUST produce concise explanatory feedback.
- **FR-008**: Original word controls MUST expose available, saved, and known states visually and through accessible names or states.
- **FR-009**: Selection feedback MUST use a polite live status and a reserved area so text changes do not shift the surrounding layout.
- **FR-010**: Changing saved or known state MUST update the current Original controls without re-translating the caption.
- **FR-011**: Captions whose selected source language is not German MUST remain plain text without word-selection controls.
- **FR-012**: The feature MUST introduce no new permissions, origins, network calls, dependencies, or caption retention.

### Key Entities

- **Original word token**: A visible lexical span with surface form, normalized key, optional dictionary metadata, caption position, and current available/saved/known state.
- **Saved vocabulary entry**: The existing local word record; its level may be unlisted only when manually selected text has no bundled vocabulary match.
- **Selection feedback**: A transient current-caption message describing the result of the latest word activation.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A learner can add a visible original-caption word to Words to learn with one activation.
- **SC-002**: Across rapid repeated activation and automatic collection, at most one saved entry exists per normalized word key.
- **SC-003**: All lexical words in a German caption are keyboard reachable and have an accessible action or state description.
- **SC-004**: Feedback for added, already-saved, and known words appears or is announced within one second of activation.
- **SC-005**: The Original and feedback region keep a fixed bounded height while caption and status content change.
- **SC-006**: Existing translation, explanation, CEFR highlighting, star, known, reset, pause, privacy, and storage behavior continue to pass regression checks.

## Assumptions

- The earlier agreed behavior is authoritative: manual additions bypass the CEFR threshold, duplicates are not created, and known words remain protected.
- The bundled vocabulary remains the only source for lemma, CEFR, meaning, and part-of-speech metadata.
- An unlisted word is useful to save even without an estimated level or definition; the UI labels that absence honestly.
- This feature applies only when the selected caption language is German.
- No new setting is needed; clickable words are the default German-caption behavior.
