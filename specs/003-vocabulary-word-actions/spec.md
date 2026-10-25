# Feature Specification: Vocabulary Word Actions

**Feature Branch**: `003-vocabulary-word-actions`

**Created**: 2026-10-25

**Status**: Ready

**Input**: User description: "Add a star and a cancel cross next to words to learn. Star means I personally tag it as important. Cross means I know it and do not want it tagged as a word to learn."

## User Scenarios & Testing

### User Story 1 - Mark an important word (Priority: P1)

As a learner, I can star a saved word so my personally important vocabulary is visually distinct and easier to find.

**Why this priority**: Personal prioritization makes the learning list more useful without changing automatic CEFR detection.

**Independent Test**: Star an unstarred word, confirm it becomes visibly starred and moves ahead of unstarred words, then reload the panel and confirm the state remains.

**Acceptance Scenarios**:

1. **Given** an unstarred saved word, **When** the learner activates its star, **Then** the word is marked important, the control communicates the active state, and the word is placed before unstarred words.
2. **Given** a starred word, **When** the learner activates its star again, **Then** the important mark is removed without removing the word.
3. **Given** an important mark was changed, **When** the panel is reopened, **Then** the chosen state remains.

---

### User Story 2 - Mark a word as known (Priority: P1)

As a learner, I can cross out a saved word I already know so it leaves the learning list and is not automatically added again.

**Why this priority**: A learning list should not repeatedly surface vocabulary the learner has explicitly dismissed as known.

**Independent Test**: Mark a saved word as known, encounter it in a later caption, and confirm it remains absent from Words to learn after the panel is reopened.

**Acceptance Scenarios**:

1. **Given** a saved word, **When** the learner activates its known-word cross, **Then** the word is removed from Words to learn and recorded as known.
2. **Given** a word has been marked known, **When** it appears in a later caption, **Then** it is not added to Words to learn again.
3. **Given** a known-word choice was made, **When** the panel is reopened, **Then** the suppression remains.

---

### User Story 3 - Recover known words (Priority: P2)

As a learner, I can reset my known-word choices so words crossed out by mistake are eligible to be collected again.

**Why this priority**: Persistent suppression needs an understandable recovery path.

**Independent Test**: Mark a word known, reset known words, then encounter the word in a new caption and confirm it can return to Words to learn.

**Acceptance Scenarios**:

1. **Given** at least one known word exists, **When** the learning section is displayed, **Then** it offers a reset action with the number of known words.
2. **Given** known words exist, **When** the learner resets them, **Then** the suppression list is cleared while currently saved learning words remain unchanged.

### Edge Cases

- Repeated rapid actions on one word must leave one valid final starred or known state.
- Marking a starred word known must remove it from the saved list and its star state with it.
- Older saved entries without an important field must remain valid and default to unstarred.
- Invalid, duplicate, or oversized retained known-word identifiers must be discarded safely.
- When the saved list reaches its limit, important words must not be displaced by newer unstarred words.
- Controls must remain understandable without relying on colour alone and must be keyboard operable.

## Requirements

### Functional Requirements

- **FR-001**: Every Words to learn entry MUST provide a star control and a known-word cross control.
- **FR-002**: The star control MUST toggle an important state without removing or changing the word's encounter data.
- **FR-003**: The star control MUST communicate its purpose, current state, and next action to keyboard and assistive-technology users.
- **FR-004**: Important words MUST appear before unstarred words; words within each group MUST retain newest-seen-first ordering.
- **FR-005**: Important state MUST persist locally when the panel closes or Chrome restarts.
- **FR-006**: Activating the cross MUST remove that word from Words to learn and add it to a persistent local known-word set.
- **FR-007**: A known word MUST be excluded from all future automatic additions to Words to learn.
- **FR-008**: The known-word control MUST name the affected word and clearly communicate that the action marks it as known.
- **FR-009**: The learning section MUST expose a reset-known action only when known words exist and MUST display the known-word count.
- **FR-010**: Resetting known words MUST make them eligible for future collection without modifying currently saved words.
- **FR-011**: Existing saved vocabulary without important-state data MUST load as unstarred without loss of encounter information.
- **FR-012**: Saved and known vocabulary data MUST remain bounded, validated, and stored only on the device.
- **FR-013**: The controls MUST fit the current compact word card at the minimum supported panel width without horizontal overflow.
- **FR-014**: The change MUST add no browser permission, network destination, or runtime dependency.

### Key Entities

- **Saved vocabulary entry**: An automatically collected learning word with its existing level, meaning, encounter metadata, and a learner-controlled important flag.
- **Known-word set**: A bounded collection of normalized word identifiers that automatic vocabulary collection must ignore.
- **Word action presentation**: The star and cross controls, including glyph, accessible name, tooltip, and pressed state where applicable.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A learner can star, unstar, or mark a word known with one action from its card.
- **SC-002**: In 100% of tested reloads, starred and known-word choices persist with no loss of existing encounter data.
- **SC-003**: In 100% of tested later captions, a known word is not re-added to Words to learn.
- **SC-004**: Important words occupy the first positions in the list while maintaining newest-seen-first order inside important and unstarred groups.
- **SC-005**: Star, cross, and reset controls expose accurate accessible names, tooltips, focus states, and non-colour state cues.
- **SC-006**: The complete automated test, security validator, and Chrome Canary verification scenarios pass.

## Assumptions

- “Star” is a toggleable personal priority, represented by an empty or filled star and sorted before unstarred entries.
- “Cross” means mark as known, not merely remove once; suppression persists locally until the learner uses Reset known.
- Marking a word known affects only the Words to learn collection. Its source-caption highlighting may still appear because CEFR highlighting describes the selected level, not personal knowledge.
- Reset known clears all known-word suppressions together; individual restoration is outside this feature's scope.
