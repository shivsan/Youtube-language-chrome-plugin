# Feature Specification: Separate Known and Remove Actions

**Feature Branch**: `main`

**Created**: 2026-10-25

**Status**: Approved for implementation

**Input**: Replace the known-word cross with a tick and make the cross remove a word without marking it known.

## User Scenarios & Testing

### User Story 1 - Mark a word as known with a tick (Priority: P1)

As a learner, I can use a tick to say that I know a saved word so it leaves Words to learn and is not automatically collected again.

**Independent Test**: Activate the tick on a saved word, confirm it leaves Words to learn, appears in Known, and remains suppressed when encountered again.

**Acceptance Scenarios**:

1. **Given** a saved word, **When** the learner activates its tick, **Then** the word leaves Words to learn and is added to Known.
2. **Given** a word was marked known with the tick, **When** it appears in a later caption, **Then** it is not automatically added to Words to learn.

### User Story 2 - Remove a word with a cross (Priority: P1)

As a learner, I can use a cross to remove a saved word without claiming that I know it.

**Independent Test**: Activate the cross on a saved word and confirm it leaves Words to learn, does not appear in Known, and remains eligible for later collection.

**Acceptance Scenarios**:

1. **Given** a saved word, **When** the learner activates its cross, **Then** the word leaves Words to learn and is not added to Known.
2. **Given** a word was removed with the cross, **When** it appears in a later caption above the learner's level, **Then** it may be collected again.

### Edge Cases

- Activating either action for a word that is no longer present has no effect.
- The tick and cross remain individually keyboard accessible and expose word-specific accessible names and tooltips.
- Rapid vocabulary actions continue through the existing serialized local-storage queue.

## Requirements

### Functional Requirements

- **FR-001**: Every Words to learn entry MUST provide distinct star, known-tick, and remove-cross controls.
- **FR-002**: The known action MUST use a tick glyph and identify itself as `Mark <word> as known`.
- **FR-003**: Activating the known tick MUST remove the word from Words to learn and add its normalized key to Known.
- **FR-004**: The remove action MUST use a cross glyph and identify itself as `Remove <word> from Words to learn`.
- **FR-005**: Activating the remove cross MUST remove the word from Words to learn without changing Known.
- **FR-006**: Tick and cross controls MUST have visually distinct success and destructive hover/focus affordances.
- **FR-007**: Existing importance, Known-tab recovery, caption collection, accessibility, persistence, and local-only behavior MUST remain unchanged.
- **FR-008**: The change MUST introduce no permission, origin, dependency, storage-schema, or network behavior.

## Success Criteria

- **SC-001**: Automated contracts distinguish the tick/known action from the cross/remove action and verify their separate persistence paths.
- **SC-002**: In Chrome Canary, the tick moves a disposable word to Known while the cross removes a disposable word without increasing Known.
- **SC-003**: The full regression suite and extension validator pass.
- **SC-004**: Both controls are usable by mouse and keyboard with accurate word-specific names and tooltips.

## Assumptions

- Cross removal is immediate, matching the existing one-click vocabulary actions.
- A cross-removed word may return through automatic collection or a later Original-word click because it was not marked known.
- No success toast is needed because the list movement is sufficient feedback.
