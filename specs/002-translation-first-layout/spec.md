# Feature Specification: Translation-First Caption Layout

**Feature Branch**: `002-translation-first-layout`

**Created**: 2026-10-25

**Status**: Ready

**Input**: User description: "Make quick translation prominent instead of the original subtitles, since the subtitles are already visible in the YouTube video."

## User Scenarios & Testing

### User Story 1 - Read the translation first (Priority: P1)

As a language learner, I can see the natural translation as the dominant content in the current-caption card so I can understand the spoken line without visually searching past a duplicate of YouTube's subtitles.

**Why this priority**: Understanding the sentence is the panel's primary purpose, while the original subtitle is already visible in the video.

**Independent Test**: Open the panel while a caption is active and confirm that the quick translation appears before the original, uses the strongest text treatment in the card, and remains readable as its length changes.

**Acceptance Scenarios**:

1. **Given** a caption has a translation, **When** the current card is displayed, **Then** the quick translation is the first text result and is visually more prominent than the original caption.
2. **Given** a translation is loading, paused, or unavailable, **When** its status message is shown, **Then** that message occupies the same primary translation region without moving the surrounding layout.
3. **Given** a translation contains more text than the primary region can show, **When** the learner reads it, **Then** the region remains a fixed size and can be scrolled without expanding the card.

---

### User Story 2 - Refer back to the original (Priority: P2)

As a language learner, I can still refer to the original caption in a quieter secondary area when I need to compare wording or review highlighted vocabulary.

**Why this priority**: The original remains useful for language study even though it should no longer compete with the translation.

**Independent Test**: With a translated German caption visible, confirm that the original appears below the translation actions, uses smaller muted text, remains keyboard-readable and scrollable, and keeps above-level vocabulary beside it.

**Acceptance Scenarios**:

1. **Given** a translated caption is shown, **When** the learner looks below the translation and explanation control, **Then** the original caption is available as a clearly labelled secondary reference.
2. **Given** the original caption contains words above the selected level, **When** the card is displayed, **Then** its highlighting and vocabulary summary remain associated with the original text.
3. **Given** the original caption is long, **When** it exceeds its secondary region, **Then** it can be scrolled without changing the card's geometry.

### Edge Cases

- Loading, paused, and model-error messages must receive the same primary placement as successful translations.
- A missing translation must not cause the original caption to jump into the primary position.
- Very long translation or original text must wrap and scroll inside bounded regions.
- Keyboard focus must remain visible on both scrollable text regions.
- Narrow side panels must preserve the translation-first order without horizontal overflow.

## Requirements

### Functional Requirements

- **FR-001**: The current card MUST identify itself as a translation-focused view.
- **FR-002**: The quick translation MUST appear before the original caption in reading and document order.
- **FR-003**: The quick translation MUST use larger, brighter, and stronger typography than the original caption.
- **FR-004**: The quick translation region MUST keep a fixed height, wrap long text, and allow vertical scrolling.
- **FR-005**: Translation loading, paused, and error messages MUST appear in the same fixed primary region as successful output.
- **FR-006**: The explanation action and any natural-language explanation MUST remain directly associated with the quick translation, before the original reference.
- **FR-007**: The original caption MUST remain visible below the translation section with a clear label and a smaller, muted treatment.
- **FR-008**: The original caption region MUST have a fixed height, wrap long text, allow vertical scrolling, and expose a visible keyboard focus state.
- **FR-009**: Above-level word highlighting and the caption-level vocabulary summary MUST continue to operate with the original caption.
- **FR-010**: Reordering and restyling MUST NOT change caption capture, translation, explanation, history, vocabulary, storage, model selection, or translation-toggle behavior.
- **FR-011**: The layout MUST remain usable at the extension's minimum supported width without horizontal scrolling.
- **FR-012**: The change MUST add no browser permissions, network destinations, retained data, or runtime dependency.

### Key Entities

- **Primary translation region**: The fixed reading area containing a translated sentence or its current status message.
- **Original reference region**: The compact, fixed reading area containing the source caption and its word-level learning cues.
- **Explanation group**: The learner-triggered action and optional explanation that elaborate on the primary translation.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In 100% of current-card states, the quick translation or its status message appears before the original caption in visual and keyboard reading order.
- **SC-002**: The quick translation uses a font at least 25% larger than the original reference and a higher-contrast text colour.
- **SC-003**: Captions and translations of at least six wrapped lines do not increase either text region's height; overflow remains locally scrollable.
- **SC-004**: The translation, explanation action, original caption, and vocabulary summary remain usable at a panel width of 320 pixels without horizontal scrolling.
- **SC-005**: Existing translation, explanation, history, vocabulary, and pause/resume automated tests continue to pass.
- **SC-006**: Manual browser verification confirms the translation-first hierarchy, stable geometry, readable focus states, and unchanged translation behavior.

## Assumptions

- “Prominent” means first in the card, larger and stronger typography, and the larger fixed reading region.
- The original caption remains available because it supports comparison, vocabulary highlighting, and accessibility even though YouTube also displays it.
- The explanation control belongs to the primary translation group; above-level vocabulary belongs to the original reference group.
- This feature changes presentation hierarchy only and does not change any language-model prompt or caption-processing behavior.
