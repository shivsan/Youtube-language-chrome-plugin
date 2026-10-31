# Feature Specification: Minimize Panel Copy

**Feature Branch**: `main`

**Created**: 2026-10-25

**Status**: Approved for implementation

**Input**: Remove redundant headings and transient success copy so the side panel gives more visual priority to translation content.

## User Scenarios & Testing

### User Story 1 - Focus on translation content (Priority: P1)

As a learner, I see the translation immediately without redundant branding and card headings consuming vertical space.

**Independent Test**: Open the panel with a current caption and confirm the brand, translation, controls, original caption, vocabulary summary, settings, and vocabulary lists remain usable without the removed headings.

**Acceptance Scenarios**:

1. **Given** the panel is open, **When** the header renders, **Then** `Language Companion` and the learner-level badge remain while `Understand every line` is absent.
2. **Given** a current caption exists, **When** the translation card renders, **Then** `NOW PLAYING` and `Current translation` are absent while the playback time and translation content remain.
3. **Given** a caption has no words above the selected level, **When** the vocabulary summary renders, **Then** it shows a single `-` instead of a sentence.

### User Story 2 - Remove unnecessary success announcements (Priority: P1)

As a learner managing known words, I do not see a redundant `Moved … back to Words to learn.` message after the word visibly moves between tabs.

**Independent Test**: Choose **Learn again** for a known word and confirm the lists and counts update without showing the success sentence.

**Acceptance Scenarios**:

1. **Given** a known word can be restored, **When** **Learn again** is selected, **Then** the word and counts update without a visible success message.
2. **Given** a restore operation fails, **When** the failure occurs, **Then** the existing actionable error message remains available and does not reserve space while empty.

### Edge Cases

- The removed visible headings must retain an accessible name for the application and current-translation region.
- Empty or loading caption states remain understandable.
- Error feedback must remain visible when present, but an empty feedback region must consume no height.

## Requirements

### Functional Requirements

- **FR-001**: The panel MUST not display `Understand every line`.
- **FR-002**: The panel MUST not display `NOW PLAYING` or `Current translation` as visible card headings.
- **FR-003**: The existing `Language Companion` brand, learner-level badge, translation control, playback time, quick translation, explanation, original caption, settings, and vocabulary features MUST remain.
- **FR-004**: A no-advanced-word result MUST display exactly `-` beneath the selected-level label.
- **FR-005**: Restoring a known word MUST update the word lists and counts without displaying `Moved <word> back to Words to learn.`
- **FR-006**: Restore failures MUST retain actionable feedback, and an empty feedback region MUST consume no layout height.
- **FR-007**: The application header and translation region MUST retain accessible names after visible copy is removed.
- **FR-008**: The change MUST introduce no new permission, origin, dependency, storage, or network behavior.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All four explicitly removed/replaced strings are absent or reduced as specified in automated UI-source contracts.
- **SC-002**: Translation, playback time, explanation, original caption, level summary, settings, and both vocabulary tabs remain visible and usable in Chrome Canary.
- **SC-003**: A successful **Learn again** operation produces no success sentence, while failure text remains supported.
- **SC-004**: The full regression suite and extension security validator pass with no new permissions or origins.

## Assumptions

- `Language Companion` remains visible because the user requested removal of the tagline, not the product name.
- The `ABOVE YOUR <level> LEVEL` label remains; only its verbose empty-state sentence becomes `-`.
- Existing error messages remain because they are actionable rather than decorative.
