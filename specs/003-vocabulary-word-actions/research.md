# Research: Vocabulary Word Actions

## Decision 1: Treat star as entry metadata

**Decision**: Store `important: true|false` on each saved vocabulary entry and sort important entries before unstarred entries, retaining newest-seen-first order within each group.

**Rationale**: Importance belongs to the saved learning item, survives existing storage updates, and can be migrated safely by defaulting missing values to false.

**Alternatives considered**:

- Separate important-key list: rejected because it creates synchronization work when entries are removed or cleared.
- Visual-only star: rejected because the user's personal tag must survive panel and browser restarts.

## Decision 2: Store known words separately

**Decision**: Store a bounded, deduplicated array of normalized vocabulary keys and filter it only when adding words to the persistent learning list.

**Rationale**: Known status must survive removal from the learning list. Filtering at the persistence boundary prevents re-addition while retaining CEFR highlights in the current caption.

**Alternatives considered**:

- Keep known words in the learning list with a status: rejected because they would still occupy the list the learner wants cleaned.
- Change the bundled CEFR data: rejected because personal knowledge is user data, not a property of the shared lexicon.

## Decision 3: Provide an aggregate recovery action

**Decision**: Show `Reset known (N)` only when known keys exist; activating it clears suppressions but does not immediately add old words back.

**Rationale**: This keeps the everyday interface compact while providing recovery from accidental crosses. Words return naturally if encountered again.

**Alternatives considered**:

- No recovery UI: rejected because a persistent destructive-looking action should be reversible.
- Full known-word management screen: rejected as disproportionate to the requested compact controls.

## Decision 4: Serialize vocabulary writes

**Decision**: Route star, known, reset, clear, and automatic collection through the existing vocabulary write queue.

**Rationale**: Serialized updates prevent rapid user actions and caption collection from overwriting one another.

**Alternatives considered**:

- Independent storage writes: rejected because last-writer-wins races could restore crossed-out words or lose star state.
